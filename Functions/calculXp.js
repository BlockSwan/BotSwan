const { XP_TO_LVL, LVL_TO_XP } = require("../constants");

module.exports = (xp) => {
  let current_xp = parseInt(xp);
  let lvl = XP_TO_LVL(current_xp);
  let base = LVL_TO_XP(lvl);
  let gained = current_xp - base;
  let required = LVL_TO_XP(lvl + 1);
  let missing = required - current_xp;
  let completion = (gained / (required - base)) * 100;

  return {
    xp: {
      current: current_xp,
      required: required,
      missing: missing,
      gained: gained,
      needed: required - base,
    },
    lvl: lvl,
    completion: parseFloat(completion.toFixed(2)),
    display: completion.toFixed(2) + "%",
  };
};
