module.exports = {
  TWENTY_HEIGHT_DAYS: 2419200000,
  FOURTEEN_DAYS: 1209600000,
  TWO_MIN: 120000,
  MAX_XP_PER_MSG: 50,
  XP_TO_LVL: (xp) => Math.floor(Math.cbrt(parseInt(xp))),
  LVL_TO_XP: (lvl) => parseInt(lvl) ** 3,
  URL: {
    resources: "https://resources.blockswan.app",
    testnet: "https://testnet.blockswan.app",
    docs: "https://docs.blockswan.app",
  },
  emoji: "<:glyph:1043982062656426125>",
};
