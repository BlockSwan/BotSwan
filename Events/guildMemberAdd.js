const Discord = require("discord.js");
const { TWO_MIN } = require("../constants");

module.exports = async (bot, member) => {
  const { guild, user } = member;
  let db = bot.db;

  let guildData = await db.Guild.findOne({ guildID: guild.id });
  if (
    !guildData ||
    Boolean(guildData.captchaChannelID === false) ||
    Boolean(guildData.verifiedRoleID === false)
  )
    return;

  let channel = guild.channels.cache.get(guildData.captchaChannelID);
  let verifiedRole = member.guild.roles.cache.get(guildData.verifiedRoleID);
  if (!channel || !verifiedRole) return;
  await channel.permissionOverwrites.create(user, {
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
    let filter = (m) => m.author.id === user.id;
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
        await user.send("You passed the captcha!");
      } catch (err) {}
      await channel.permissionOverwrites.delete(user.id);
      member.roles.add(verifiedRole);
      //db.query

      // const newInvites = await member.guild.invites.fetch();
      // const oldInvites = invites.get(member.guild.id);
      // const invite = newInvites.find((i) => i.uses > oldInvites.get(i.code));
      // const inviter = await client.users.fetch(invite.inviter.id);
      // // Get the log channel (change to your liking)
      // const logChannel = member.guild.channels.cache.find(
      //   (channel) => channel.name === "join-logs"
      // );
      // // A real basic message with the information we need.
      // inviter
      //   ? logChannel.send(
      //       `${member.user.tag} joined using invite code ${invite.code} from ${inviter.tag}. Invite was used ${invite.uses} times since its creation.`
      //     )
      //   : logChannel.send(
      //       `${member.user.tag} joined but I couldn't find through which invite.`
      //     );
    } else {
      await msg.delete();
      await response.delete();
      try {
        await user.send(
          `You failed the captcha\nTry again: https://discord.gg/${retry.code}`
        );
      } catch (err) {}
      await channel.permissionOverwrites.delete(user.id);
      await member.kick("Captcha failed");
    }
  } catch (err) {
    await msg.delete();
    try {
      await user.send(
        `You took to long to complete the captcha.\nTry again: https://discord.gg/${retry.code}`
      );
    } catch (err) {}
    await channel.permissionOverwrites.delete(user.id);
    await member.kick("Captcha not filled");
  }
};
