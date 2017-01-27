const Game = require('./lib/game');
const Sequence = require('./lib/sequence');
const Players = require('./lib/players');
const Elements = require('./lib/elements');

const gameBase = new (function() {
    this.Game = new Game(this);
    this.Sequence = new Sequence(this);
    this.Players = new Players(this);
    this.Elements = new Elements(this);
})();

module.exports = gameBase;