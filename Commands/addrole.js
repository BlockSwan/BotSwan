const Discord = require("discord.js");

module.exports = {
  name: "addrole",
  description: "Add custom reaction role",
  permission: Discord.PermissionFlagsBits.ManageRoles,
  dm: false,
  category: "Administration",
  options: [
    {
      type: "role",
      name: "role",
      description: "The role to add",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "description",
      description: "The role description",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "emoji",
      description: "The role emoji",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args, db) {
    const { guildId, member } = message;

    const role = args.getRole("role");
    const description = args.getString("description");
    const emoji = args.getString("emoji");

    try {
      if (role.position >= member.roles.highest.position)
        return bot.function.reply.error(
          message,
          "I don't have permission for that"
        );
      let req = await db.Guild.findOne({ guildID: guildId });
      bot.log.query("read", "reading Guild " + guildId);
      let reactionRoles = req?.reactionRoles || [];
      const newRole = {
        roleID: role.id,
        description: description || "No description",
        emoji: emoji,
      };

      var foundRole = reactionRoles?.findIndex((x) => x?.roleID == role?.id);
      let word;
      if (foundRole === -1 || foundRole === undefined) {
        reactionRoles.push(newRole);
        word = "added";
      } else {
        reactionRoles[foundRole] = newRole;
        word = "edited";
      }

      await db.Guild.updateOne(
        { guildID: guildId },
        { reactionRoles: reactionRoles }
      );
      bot.log.query("write", "UPDATING Guild " + guildId);
      return bot.function.reply.success(
        message,
        `Role succesfully ${word}! We currently have ${reactionRoles?.length} role(s)`
      );
    } catch (err) {
      console.log(err);
    }
  },
};
