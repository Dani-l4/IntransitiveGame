const _ = require('underscore');
const io = require('console-read-write');
const { AsciiTable3 } = require('ascii-table3');

const errors = {
    1: 'Wrong number of moves! Support only 3+ moves. Try again.',
    2: 'Support only odd number of moves. Try again.',
    3: 'Duplicate moves are not allowed. Try again.'
}
const possibleEndGame = {
    '-1': 'Win',
    '0': 'Draw',
    '1': 'Lose'
}

class Game {
    constructor() {
        this.hmac = null;
        this.pcMove = null;
        this.playerMove = null;
        this.winner = null;
        this.availableMoves = null
        this.moves = null;
    }

    #checkMoves(moves) {
        if (moves.length < 3) return console.log(errors[1]);
        if (!(moves.length % 2)) return console.log(errors[2]);
        if (new Set(moves).size !== moves.length) return console.log(errors[3]);
        return true;
    }

    canStart(moves) {
        if (this.#checkMoves(moves)) {
            this.moves = moves;
            this.#getAvailableMovesString();
            this.half = Math.floor(this.moves.length / 2);
            return true;
        }
    }

    #getAvailableMovesString() {
        const availableMoves = [];
        this.moves.forEach((move, idx) => availableMoves.push(`\n${idx+1} - ${move}`));
        availableMoves.push('\n0 - exit', '\n? - help');
        this.availableMoves = availableMoves.join('');
    }

    pcMakeMove() {
        return this.pcMove = _.sample(this.moves);
    }
    
    showHmac() {
        console.log('HMAC:', this.hmac);
    }

    #createMenu() {
        console.log('Available moves:', this.availableMoves);
    }

    #inputIsCorrect (input) {
        return parseInt(input) >= 0 && parseInt(input) <= this.moves.length || input == '?';
    }
 
    requestPlayerMove() {
        let input = -1; // incorrect input by default
        return new Promise(async (resolve) => {
            while (!this.#inputIsCorrect(input)) {
                this.#createMenu();
                input = await io.ask('Enter your move:');
                if (input == 0) {
                    process.exit();
                } else if(input == '?') {
                    return this.displayHelpTable();
                } else continue
            }
            resolve(this.playerMove = this.moves[input - 1]);
        })
    }

    showPlayerMove() {
        console.log('Your move:', this.playerMove);
    }

    showPcMove() {
        console.log('Computer move:', this.pcMove);
    }
    
    showWinner() {
        console.log(this.winner);
    }

    #getTableData() {
         const data = [];
         for (let pcMove = 0; pcMove < this.moves.length; pcMove++) {
            let row = [this.moves[pcMove]];
            for (let playerMove = 0; playerMove < this.moves.length; playerMove++) {
                const judge = Math.sign(
                    (pcMove - playerMove + this.half + this.moves.length) 
                    % this.moves.length - this.half
                );
                row.push(possibleEndGame[judge]);
            } 
            data.push(row)
         }
         return data;
    }

    displayHelpTable() {
        let table = new AsciiTable3()
            .setHeading('v PC\\Player >', ...this.moves)
            .addRowMatrix(this.#getTableData());
        console.log("The table shown from the Player's perspective");
        console.log(table.toString());
    }
}

module.exports = Game;