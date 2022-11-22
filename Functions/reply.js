const ErrorEmbed = require("../Components/Embeds/Error");
const SuccessEmbed = require("../Components/Embeds/Success");

module.exports = {
  error: (interaction, description) => {
    embed = ErrorEmbed(description);
    interaction.reply({ embeds: [embed], ephemeral: true });
  },

  success: (interaction, description, fields) => {
    embed = SuccessEmbed(description, fields);
    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
