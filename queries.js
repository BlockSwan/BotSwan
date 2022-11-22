module.exports = {
  saveWarn: (guild, user, author, warn_id, reason, date) =>
    `INSERT INTO Warn (guild, user, author, warn_id, reason, date) VALUES ('${guild}', '${user}','${author}','${warn_id}','${reason}','${date}')`,
  getWarn: (guild, user) =>
    `SELECT * FROM Warn WHERE guild = '${guild}' AND user = '${user}'`,
  getGuild: (guild_id) => `SELECT * FROM Guild WHERE guild_id = '${guild_id}'`,
  initGuild: (guild_id) =>
    `INSERT INTO Guild (guild_id, captcha, suggest, level, ticket, transcript, parentTicket, everyone) VALUES ('${guild_id}', 'false', 'false', 'false','false', 'false', 'false', 'false')`,
  getUser: (discord_id, guild_id) =>
    `SELECT * FROM User WHERE guild_id = '${guild_id}' AND discord_id = '${discord_id}'`,
  initUser: (user_id, discord_id, guild_id) =>
    `INSERT INTO User (user_id, discord_id, guild_id, xp, date) VALUES ('${user_id}', '${discord_id}', '${guild_id}', '0', '${Date.now()}')`,
  addXp: (discord_id, guild_id, xp) =>
    `UPDATE User SET xp = '${xp}' WHERE guild_id = '${guild_id}' AND discord_id = '${discord_id}'`,
  getAllUsers: (guild_id) =>
    `SELECT * FROM User WHERE guild_id = '${guild_id}'`,
  editLevelChannel: (guild_id, state) =>
    `UPDATE Guild SET level = '${state}' WHERE guild_id = '${guild_id}'`,
  editCaptchaChannel: (guild_id, state) =>
    `UPDATE Guild SET captcha = '${state}' WHERE guild_id = '${guild_id}'`,
  editSuggestionChannel: (guild_id, state) =>
    `UPDATE Guild SET suggest = '${state}' WHERE guild_id = '${guild_id}'`,
  editTwitterChannel: (guild_id, state) =>
    `UPDATE Guild SET twitter = '${state}' WHERE guild_id = '${guild_id}'`,
  editTicketChannels: (guild_id, ticket, transcript, parentTicket, everyone) =>
    `UPDATE Guild SET ticket = '${ticket}', transcript = '${transcript}', parentTicket = '${parentTicket}', everyone = '${everyone}' WHERE guild_id = '${guild_id}'`,
  getTicket: (channel_id, guild_id) =>
    `SELECT * FROM Ticket WHERE guild_id = '${guild_id}' AND channel_id = '${channel_id}'`,
  editTicketMembers: (channel_id, guild_id, new_json) =>
    `UPDATE Ticket SET members_json = '${new_json}' WHERE channel_id = '${channel_id}' AND guild_id = '${guild_id}'`,
  initTicket: (
    guild_id,
    channel_id,
    ticket_id,
    isClose,
    isLock,
    isTranscript,
    type,
    members_json
  ) =>
    `INSERT INTO Ticket (guild_id, channel_id, ticket_id, isClose, isLock, isTranscript, type, date, members_json) VALUES ('${guild_id}',  '${channel_id}', '${ticket_id}', ${isClose}, ${isLock}, ${isTranscript}, '${type}','${Date.now()}', '${members_json}')`,
  closeTicket: (ticket_id) =>
    `UPDATE Ticket SET isClose = ${true} WHERE ticket_id = '${ticket_id}'`,
  lockTicket: (ticket_id) =>
    `UPDATE Ticket SET isLock = ${true} WHERE ticket_id = '${ticket_id}'`,
  unlockTicket: (ticket_id) =>
    `UPDATE Ticket SET isLock = ${false} WHERE ticket_id = '${ticket_id}'`,
  enableTicketTranscript: (ticket_id) =>
    `UPDATE Ticket SET isTranscript = ${true} WHERE ticket_id = '${ticket_id}'`,
  toggleTicketTranscript: (ticket_id, state) =>
    `UPDATE Ticket SET isTranscript = ${state} WHERE ticket_id = '${ticket_id}'`,
  getAllTwitterChannels: () =>
    `SELECT DISTINCT twitter FROM Guild WHERE twitter <> 'false'`,
  editRoleReaction: (role_json, guild_id) => {
    `UPDATE Guild SET reactionRole_json = '${role_json}' WHERE guild_id = '${guild_id}'`;
  },
};
