const Canvas = require("canvas");
const Discord = require("discord.js");

Canvas.registerFont(`Assets/fonts/Saira-Medium.ttf`, {
  family: "Saira",
});

//const image_background = require("../../Assets/imgs/rank");

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

module.exports = class Card {
  constructor() {
    this.bot = null;
    this.guild = null;
    this.background = null;
    this.user = null;
    this.rank = null;
    this.level = null;
    this.need = null;
    this.xp = null;
    this.colorFont = null;
    this.colorProgressBar = null;
  }

  /**
   * @param {Discord.Client} value
   */

  setBot(value) {
    this.bot = value;
    return this;
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

  /**
   * @param {number} value
   */

  setRank(value) {
    this.rank = value;
    return this;
  }

  /**
   * @param {number} value
   */

  setLevel(value) {
    this.level = value;
    return this;
  }

  /**
   * @param {number} value
   */

  setXpNeed(value) {
    this.need = value;
    return this;
  }

  /**
   * @param {number} value
   */

  setXp(value) {
    this.xp = value;
    return this;
  }

  /**
   * @param {string} value
   */

  setColorFont(value) {
    this.colorFont = value;
    return this;
  }

  /**
   * @param {string} value
   */

  setColorProgressBar(value) {
    this.colorProgressBar = value;
    return this;
  }

  async toCard() {
    if (
      this.bot === null ||
      this.bot.token === undefined ||
      this.bot.token === null ||
      typeof this.bot !== "object"
    )
      throw new Error("The .setBot must be a Discord Client !");
    if (
      this.guild === null ||
      this.guild.id === undefined ||
      this.guild.id === null
    )
      throw new Error("The .setGuild must be a Discord Guild !");
    if (this.background === null || typeof this.background !== "string")
      throw new Error("The .setBackground must be a string !");
    if (
      this.user === null ||
      this.user.id === undefined ||
      this.user.id === null
    )
      throw new Error("The .setUser must be a Discord User !");
    if (this.rank === null || typeof this.rank !== "number") this.rank = 2;
    if (this.xp === null || typeof this.xp !== "number") this.xp = 2457;
    if (this.need === null || typeof this.need !== "number") this.need = 6000;
    if (this.level === null || typeof this.level !== "number") this.level = 5;
    if (
      this.colorFont === null ||
      typeof this.colorFont !== "string" ||
      !this.colorFont.match(new RegExp(/^#[0-9a-f]{6}/i))
    )
      this.colorFont = "#000000";
    if (
      this.colorProgressBar === null ||
      typeof this.colorProgressBar !== "string" ||
      !this.colorProgressBar.match(new RegExp(/^#[0-9a-f]{6}/i))
    )
      this.colorProgressBar = "#ff4837";

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
    const badges = await this.user.fetchFlags();
    const badge = badges
      .toArray()
      .filter(
        (b) =>
          b !== "BotHTTPInteractions" &&
          b !== "Quarantined" &&
          b !== "Spammer" &&
          b !== "TeamPseudoUser" &&
          b !== "VerifiedBot"
      );

    if (this.xp > this.need) this.xp = this.need;
    if (this.xp < 0) this.xp = 0;

    const barre = Math.floor((this.xp / this.need) * 490);

    //Barre d'xp qui ne se remplie pas
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.fillStyle = "#f1f1f1";
    ctx.moveTo(220, 92.5);
    ctx.quadraticCurveTo(220, 75, 240, 75);
    ctx.lineTo(710, 75);
    ctx.quadraticCurveTo(730, 75, 730, 92.5);
    ctx.quadraticCurveTo(730, 110, 710, 110);
    ctx.lineTo(240, 110);
    ctx.quadraticCurveTo(220, 110, 220, 92.5);
    ctx.fill();
    ctx.closePath();

    //Barre d'xp qui se remplie
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;

    ctx.fillStyle = this.colorProgressBar;
    ctx.moveTo(220, 92.5);
    ctx.quadraticCurveTo(220, 75, 240, 75);
    ctx.lineTo(240 + barre - 20, 75);
    ctx.quadraticCurveTo(240 + barre, 75, 240 + barre, 92.5);
    ctx.quadraticCurveTo(240 + barre, 110, 240 + barre - 20, 110);
    ctx.lineTo(240, 110);
    ctx.quadraticCurveTo(220, 110, 220, 92.5);
    ctx.fill();
    ctx.closePath();

    //Pourcentage + Xp
    ctx.font = '20px "Saira"';
    ctx.fillStyle = this.colorFont === "#ffffff" ? "#000000" : this.colorFont;
    ctx.fillText(`${Math.floor((this.xp * 100) / this.need)}%`, 665, 100);

    //Level + Rang
    ctx.font = '36px "Saira"';
    ctx.fillStyle = this.colorFont;
    ctx.fillText(`Level ${this.level}`, 275, 160);
    this.rank = ctx.fillText(`Rank ${this.rank}#`, 520, 160);

    //Tag de l'utilisateur
    ctx.font = '36px "Saira"';
    ctx.fillStyle = this.colorFont;
    ctx.fillText(
      `${
        this.user.tag.length > 15
          ? this.user.tag.slice(0, 15) + "..."
          : this.user.tag
      }`,
      275,
      210
    );

    //Avatar

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
