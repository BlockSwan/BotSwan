const Canvas = require("canvas");
const Discord = require("discord.js");

Canvas.registerFont(`Assets/fonts/Saira-Medium.ttf`, {
  family: "Saira",
});

Canvas.CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};

module.exports = class Home {
  constructor() {
    this.guild = null;
    this.background = null;
    this.user = null;
    this.text = null;
    this.colorFont = null;
    this.visitor = null;
  }

  /**
   * @param {Discord.Guild} value
   */

  setGuild(value) {
    this.guild = value;
    return this;
  }

  /**
   * @param {Discord.User} value
   */

  setUser(value) {
    this.user = value;
    return this;
  }

  /**
   * @param {string} value
   */

  setBackground(value) {
    this.background = value;
    return this;
  }

  setVisitor(nbr) {
    this.visitor = nbr;
    return this;
  }

  /**
   * @param {string} value
   */

  setText(value) {
    this.text = value;
    return this;
  }

  /**
   * @param {string} value
   */

  setColorFont(value) {
    this.colorFont = value;
    return this;
  }

  async toWelcome() {
    if (
      this.guild === null ||
      this.guild.id === undefined ||
      this.guild.id === null
    )
      throw new Error("The .setGuild must be a Discord Guild !");
    // if (this.background === null || typeof this.background !== "string")
    //    throw new Error("The .setBackground must be a string !");
    if (
      this.user === null ||
      this.user.id === undefined ||
      this.user.id === null
    )
      throw new Error("The .setUser must be a Discord User !");
    if (this.text === null || typeof this.text !== "string")
      this.text = "Welcome on the server {server.name} !";
    if (
      this.colorFont === null ||
      typeof this.colorFont !== "string" ||
      !this.colorFont.match(new RegExp(/^#[0-9a-f]{6}/i))
    )
      this.colorFont = "#ffffff";

    const canvas = Canvas.createCanvas(800, 300);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage(
      `${__dirname}/../Assets/imgs/rank_background.png`
    );
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const member = this.guild.members.cache.get(this.user.id);
    const status = member
      ? member.presence
        ? member.presence.status
        : "offline"
      : "offline";

    this.text = this.text.replace(/{user.username}/g, `${this.user.username}`);
    this.text = this.text.replace(/{user.tag}/g, `${this.user.tag}`);
    this.text = await this.text.replace(/{server.name}/g, `${this.guild.name}`);
    this.text = await this.text.replace(
      /{server.memberCount}/g,
      `${this.guild.memberCount}`
    );

    ctx.font = '40px "Saira"';
    ctx.fillStyle = "#000000";
    ctx.fillText(
      `${this.user.username}` + `${this.user.discriminator}`,
      285,
      90
    );

    ctx.font = '60px "Saira"';
    ctx.fillStyle = "#000000";
    ctx.fillText(`Visitor n°${this.visitor}`, 285, 170);

    ctx.font = '20px "Saira"';
    ctx.fillStyle = "#000000";
    ctx.fillText(`Welcome to Blockswan Virtual Office`, 285, 232.5);

    ctx.beginPath();
    ctx.roundRect(60, 50, 200, 200, 20);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(
      member
        ? member.avatar
          ? member.avatarURL({ extension: "png" })
          : this.user.displayAvatarURL({ extension: "png" })
        : this.user.displayAvatarURL({ extension: "png" })
    );
    ctx.drawImage(avatar, 60, 50, 200, 200);

    return canvas;
  }
};
