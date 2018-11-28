
module.exports = {
  compareRace: function(a,b) {
    a = a.date
    b = b.date
    if (a < b)
      return -1;
    if (a > b)
      return 1;
    return 0;
  },

  comparePlayerNames: function(a, b) {
    a = a.name
    b = b.name
    if (a < b)
      return -1;
    if (a > b)
      return 1;
    return 0;
  },
}