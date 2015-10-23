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
    var moved = false;
    if (keyCode === 37 && board.isMoveXPossible()) {
      board.moveLeft();
      moved = true;
    } else if (keyCode === 38 && board.isMoveYPossible()) {
      board.moveUp();
      moved = true;
    } else if (keyCode === 39 && board.isMoveXPossible()) {
      board.moveRight();
      moved = true;
    } else if (keyCode === 40 && board.isMoveYPossible()) {
      board.moveDown();
      moved = true;
    }

    if (moved) {
      if (board.isGameOver()) {
        alert('game over!');
      } else {
        board.nextRound();
      }
    }
  }
}

document.board = board;
