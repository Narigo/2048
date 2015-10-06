var Board = require('./Board');

var tiles = document.querySelectorAll('.tile');

var board = new Board(tiles);

console.log(board);
board.nextRound();
board.nextRound();
