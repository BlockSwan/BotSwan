const Discord = require("discord.js");
const { TWO_MIN } = require("../constants");

module.exports = async (bot, member) => {
  const { guild, user } = member;
  let db = bot.db;

  let invite = await bot.function.getInvite(bot, member);

  let guildData = await db.Guild.findOne({ guildID: guild.id });

  if (!guildData) {
    await db.Guild.initGuild(guild);
  }

  let newMember = await db.User.findOne({
    guildID: guild.id,
    discordID: user.id,
  });

  if (!newMember)
    await db.User.initUser(user.id, guild.id, invite?.inviter?.id || "none");
  else {
    await db.User.updateMembershipAndInviter(
      user.id,
      guild.id,
      true,
      invite?.inviter?.id || "none"
    );
  }

  let visitorCount = await db.User.getUniqueVisitorCount(guild.id);

  let welcomeChannel = guild.channels.cache.get(guildData?.welcomeChannelID);

  if (
    (guildData.captchaChannelID === "false" ||
      guildData.verifiedRoleID === "false") &&
    !welcomeChannel
  ) {
    return;
  } else if (
    (guildData.captchaChannelID === "false" ||
      guildData.verifiedRoleID === "false") &&
    welcomeChannel
  ) {
    return await bot.function.createWelcomeCard(
      guild,
      user,
      welcomeChannel,
      visitorCount,
      invite
    );
  }

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
      if (welcomeChannel) {
        await bot.function.createWelcomeCard(
          guild,
          user,
          welcomeChannel,
          visitorCount,
          invite
        );
      }
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
      await db.User.updateMembership(user.id, guild.id, false);
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
    await db.User.updateMembership(user.id, guild.id, false);
  }
};
