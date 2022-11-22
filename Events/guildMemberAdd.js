const Discord = require("discord.js");
const { TWO_MIN } = require("../constants");

module.exports = async (bot, member) => {
  let db = bot.db;

  db.query(bot.queries.getGuild(member.guild.id), async (err, guildData) => {
    if (guildData?.length < 1 || Boolean(guildData[0].captcha === false))
      return;

    let channel = member.guild.channels.cache.get(guildData[0].captcha);
    if (!channel) return;
    await channel.permissionOverwrites.create(member.user, {
      SendMessages: true,
      ViewChannel: true,
      ReadMessageHistory: true,
    });
    let captcha = await bot.function.generateCaptcha();

    let msg = await channel.send({
      content: `${member}, you have 2min to complete the captcha. If you don't, you will be kick from the server.`,
      files: [new Discord.AttachmentBuilder((await captcha.canvas).toBuffer())],
      name: "captcha.png",
    });

    let retry = await channel.createInvite({
      unique: true,
      temporary: false,
    });

    try {
      let filter = (m) => m.author.id === member.user.id;
      let response = (
        await channel.awaitMessages({
          filter,
          max: 1,
          time: TWO_MIN,
          errors: ["time"],
        })
      ).first();

      if (response.content === captcha.text) {
        await msg.delete();
        await response.delete();
        try {
          await member.user.send("You passed the captcha");
        } catch (err) {}
        await channel.permissionOverwrites.delete(member.user.id);

        const newInvites = await member.guild.invites.fetch();
        const oldInvites = invites.get(member.guild.id);
        const invite = newInvites.find((i) => i.uses > oldInvites.get(i.code));
        const inviter = await client.users.fetch(invite.inviter.id);
        // Get the log channel (change to your liking)
        const logChannel = member.guild.channels.cache.find(
          (channel) => channel.name === "join-logs"
        );
        // A real basic message with the information we need.
        inviter
          ? logChannel.send(
              `${member.user.tag} joined using invite code ${invite.code} from ${inviter.tag}. Invite was used ${invite.uses} times since its creation.`
            )
          : logChannel.send(
              `${member.user.tag} joined but I couldn't find through which invite.`
            );
      } else {
        await msg.delete();
        await response.delete();
        try {
          await member.user.send(
            `You failed the captcha\nTry again: https://discord.gg/${retry.code}`
          );
        } catch (err) {}
        await channel.permissionOverwrites.delete(member.user.id);
        await member.kick("Captcha failed");
      }
    } catch (err) {
      await msg.delete();
      try {
        await member.user.send(
          `You took to long to complete the captcha.\nTry again: https://discord.gg/${retry.code}`
        );
      } catch (err) {}
      await channel.permissionOverwrites.delete(member.user.id);
      await member.kick("Captcha not filled");
    }
  });
};
