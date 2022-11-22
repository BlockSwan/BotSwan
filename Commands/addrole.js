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
      db.query(bot.queries.getGuild(guildId), async (err, req) => {
        let json = JSON.parse(req?.reactionRole_json);
        const newRole = {
          roleId: role.id,
          roleDescription: description || "No description",
          roleEmoji: emoji,
        };

        var foundRole = json?.findIndex((x) => x.id == role.id);
        if (foundRole === -1) {
          json.push(newRole);
        } else {
          json[i] = newRole;
        }

        db.query(bot.queries.editRoleReaction(JSON.stringify(json), guildId));
      });
    } catch (err) {
      console.log(err);
    }
  },
};
