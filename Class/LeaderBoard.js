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

module.exports = class Leaderboard {
  constructor() {
    this.bot = null;
    this.guild = null;
    this.background = null;
    this.colorFont = null;
    this.users = [];
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
   * @param {string} value
   */

  setBackground(value) {
    this.background = value;
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
   * @param {Discord.User} user
   * @param {number} level
   * @param {number} xp
   * @param {number} need
   */

  addUser(user, level, xp, need) {
    this.users.push({ user, level, xp, need });
    return this;
  }

  async toLeaderboard() {
    let count = this.users.length >= 10 ? 10 : this.users.length;

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
      this.guild.id === null ||
      typeof this.guild !== "object"
    )
      throw new Error("The .setGuild must be a Discord Guild !");
    if (this.background === null || typeof this.background !== "string")
      throw new Error("The .setBackground must be a string !");
    if (count <= 0)
      throw new Error("The number of users must be greater than 1 !");
    if (count > 10)
      throw new Error("The number of users must be less than 10 !");
    if (
      this.colorFont === null ||
      !this.colorFont.match(new RegExp(/^#[0-9a-f]{6}/i))
    )
      this.colorFont = "#000000";

    for (let i = 0; i < count; i++) {
      if (
        this.users[i].user === null ||
        this.users[i].user.id === undefined ||
        this.users[i].user.id === null ||
        typeof this.users[i].user !== "object"
      )
        throw new Error("The user of the .addUser must be a Discord User !");
      if (
        this.users[i].level === null ||
        typeof this.users[i].level !== "number"
      )
        throw new Error("The level of the .addUser must be a number !");
      if (this.users[i].xp === null || typeof this.users[i].xp !== "number")
        throw new Error("The xp of the .addUser must be a number !");
      if (this.users[i].need === null || typeof this.users[i].need !== "number")
        throw new Error("The need of the .addUser must be a number !");
    }

    const leaderboard = this.users.sort(function (a, b) {
      return parseFloat(b.xp) - parseFloat(a.xp);
    });

    const canvas = Canvas.createCanvas(
      800,
      leaderboard.length >= 10 ? 10 * 280 + 120 : leaderboard.length * 280 + 170
    );
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, 25);
    ctx.closePath();
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    const logo = await Canvas.loadImage(
      `${__dirname}/../Assets/imgs/blockswan_discord_community.png`
    );
    ctx.drawImage(logo, canvas.width / 5 - 10, 50);

    for (let i = 0; i < count; i++) {
      ctx.font = '40px "Saira"';
      ctx.fillStyle = this.colorFont;
      ctx.fillText(
        `${
          leaderboard[i].user.tag.length > 20
            ? leaderboard[i].user.tag.slice(0, 20)
            : leaderboard[i].user.tag
        }`,
        320,
        305 + i * 230,
        500
      );

      ctx.font = '40px "Saira"';
      ctx.fillStyle = this.colorFont;
      ctx.fillText(
        `Rank ${i + 1 === 1 ? "1#" : `${i + 1}#`}`,
        320,
        350 + i * 230
      );
      ctx.fillText(`lvl ${leaderboard[i].level}`, 320, 395 + i * 230);
      ctx.fillText(
        `${leaderboard[i].xp} / ${leaderboard[i].need} xp`,
        320,
        440 + i * 230
      );
    }
    for (let i = 0; i < count; i++) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(60, 250 + i * 230, 200, 200, 20);
      ctx.closePath();
      ctx.clip();

      //Avatar
      const user = await this.bot.users.fetch(leaderboard[i].user.id);
      const member = this.guild.members.cache.get(leaderboard[i].user.id);

      if (user) {
        const avatar = await Canvas.loadImage(
          member
            ? member.avatar
              ? member.avatarURL({ extension: "jpg" })
              : user.displayAvatarURL({ extension: "jpg" })
            : user.displayAvatarURL({ extension: "jpg" })
        );
        ctx.drawImage(avatar, 60, 250 + i * 230, 200, 200);
      }
      ctx.restore();
    }

    return canvas;
  }
};
