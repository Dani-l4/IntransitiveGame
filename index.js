const Game = require('./Game');
const Rules = require('./Rules');
const FairPlay = require('./FairPlay');

const moves = process.argv.slice(2);
const game = new Game();

async function start() {
    const rules = new Rules(moves);
    const fp = new FairPlay();
    game.pcMakeMove();
    game.hmac = fp.genHmac(game.pcMove);
    game.showHmac();
    await game.requestPlayerMove();
    game.showPlayerMove();
    game.showPcMove();
    game.winner = rules.determineWinner(game.pcMove, game.playerMove);
    game.showWinner();
    fp.showKey();
}

if (game.canStart(moves)) {
    start()
}