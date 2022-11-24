const WelcomeCard = require("../Class/Welcome");
const { emoji } = require("../constants");
const Discord = require("discord.js");

module.exports = async (guild, user, channel, visitorNbr, invite) => {
  let welcomeCard = new WelcomeCard();

  welcomeCard
    .setGuild(guild)
    .setUser(user)
    .setText(`Welcome to ${emoji} **Blockswan Virtual Office**`)
    .setVisitor(visitorNbr);

  const Image = await welcomeCard.toWelcome();
  let content = invite
    ? `Welcome our new visitor invited by ${invite.inviter}!`
    : `Welcome our new visitor!`;
  await channel.send({
    content: content,
    files: [
      new Discord.AttachmentBuilder(Image.toBuffer(), {
        name: "welcome.png",
      }),
    ],
  });
};
