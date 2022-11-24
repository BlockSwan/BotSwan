const {
  ApplicationCommandOptionWithChoicesAndAutocompleteMixin,
} = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  name: "setcounter",
  description: "Add a role counter in a voice channel ",
  permission: Discord.PermissionFlagsBits.ManageRoles,
  dm: false,
  category: "Administration",
  options: [
    {
      type: "channel",
      name: "channel",
      description: "The voice channel to display the counter",
      required: true,
      autocomplete: false,
    },
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
      description: "Use %% where the count should appear",
      required: true,
      autocomplete: false,
    },
  ],

  async run(bot, message, args, db) {
    const { guildId, member } = message;

    const role = args.getRole("role");
    const description = args.getString("description");
    const channel = args.getChannel("channel");

    try {
      if (!channel || channel?.type !== 2)
        return bot.function.reply.error(
          message,
          "No channel or channel not a voice channel"
        );
      if (!description || !description.includes("%%"))
        return bot.function.reply.error(
          message,
          "Description must include %% where the counter will be displayed"
        );
      if (role.position >= member.roles.highest.position)
        return bot.function.reply.error(
          message,
          "I don't have permission for that"
        );
      let req = await db.Guild.findOne({ guildID: guildId });
      bot.log.query("read", "reading Guild " + guildId);

      let roleCounters = req?.roleCounters || [];

      const newRoleCounter = {
        roleID: role.id,
        description: description || "No description",
        channel: channel.id,
      };

      var foundChannel = roleCounters?.findIndex(
        (x) => x?.channel == channel?.id
      );

      let word;
      if (foundChannel === -1 || foundChannel === undefined) {
        roleCounters.push(newRoleCounter);
        word = "added";
      } else {
        roleCounters[foundChannel] = newRoleCounter;
        word = "edited";
      }

      await db.Guild.updateOne(
        { guildID: guildId },
        { roleCounters: roleCounters }
      );
      bot.log.query("write", "UPDATING Guild " + guildId);
      channel.permissionOverwrites.edit(message.guild.roles.everyone.id, {
        Connect: false,
      });
      console.log(description);
      let toSend = await message.guild.channels.fetch(channel.id);
      if (toSend) {
        let count = await bot.function.countRoleMember(message.guild, role.id);
        let text = description.replace("%%", count);
        channel.setName(text);
      }
      return bot.function.reply.success(
        message,
        `Counter succesfully ${word}! We currently have ${roleCounters?.length} couter(s)`
      );
    } catch (err) {
      console.log(err);
    }
  },
};
