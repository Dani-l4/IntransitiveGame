const { Yallist } = require('yallist');

class Rules {
    constructor(moves) {
        this.moves = new Yallist(moves)
        this.moves.head.prev = this.moves.tail
        this.moves.tail.next = this.moves.head
        this.half = Math.floor(this.moves.length / 2);
        this.winners = [];
    }

    #find(move) {
        let current = this.moves.head;
        while (current && current.value !== move) current = current.next;
        return current;
    }

    #getWinners(move) {
        let current = move;
        for(let i = 0; i < this.half; i++) {
            this.winners.push(current.next.value);
            current = current.next;
        }
    }

    determineWinner(pcChoice, playerChoice) {
        if (pcChoice === playerChoice) return 'Draw';
        const pcMove = this.#find(pcChoice);
        this.#getWinners(pcMove);
        return this.winners.includes(playerChoice) ? 'You win!' : 'Computer win!';
    }
}

module.exports = Rules;