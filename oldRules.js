class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class Rules {
    constructor(moves) {
        this.head = null;
        this.tail = null;
        this.half = Math.floor(moves.length / 2);
        this.winners = [];
        moves.forEach(move => this.#appendMove(move));
    }

    #appendMove(move) {
        const newNode = new Node(move);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode
        }
        this.tail.next = this.head;
        this.head.prev = this.tail;
    }

  #find(move) {
      let current = this.head;
      while (current && current.value !== move) {
          current = current.next;
          if (current === this.head) return null;
      }
      return current;
  }

  #getWinners(move) {
      let current = move;
      for(let i = 0; i < this.half; i++) {
          this.winners.push(current.next.value);
          current = current.next;
      }
  }
//   Tell, Don't Ask
// return who is winner
  determineWinner(pcChoice, playerChoice) {
      if (pcChoice === playerChoice) return 'Draw';
      const pcMove = this.#find(pcChoice);
      this.#getWinners(pcMove);
      if (this.winners.includes(playerChoice)) {
          return 'Player wins';
      } else {
          return 'PC wins';
      } 
  }
}

module.exports = Rules;