var Board = require('./Board');

var tiles = document.querySelectorAll('.tile');

var board = new Board(tiles);

console.log(board);
board.nextRound();
board.nextRound();

document.onkeydown = onKeyDown;

function onKeyDown(e) {
  var event = e || window.event;
  event.preventDefault();
  event.stopPropagation();
  move(event.keyCode);

  function move(keyCode) {
    if (keyCode === 37 && board.isMoveXPossible()) {
      board.moveLeft();
      board.nextRound();
    } else if (keyCode === 38 && board.isMoveYPossible()) {
      board.moveUp();
      board.nextRound();
    } else if (keyCode === 39 && board.isMoveXPossible()) {
      board.moveRight();
      board.nextRound();
    } else if (keyCode === 40 && board.isMoveYPossible()) {
      board.moveDown();
      board.nextRound();
    }
  }

  console.log(event.keyCode);
}

document.board = board;
