var Board = require('./Board');

var $tiles = document.querySelectorAll('.tile');
var $currentScore = document.getElementById('currentScore');
var $highestScore = document.getElementById('highestScore');
var board;

document.onkeydown = onKeyDown;

var undoBtn = document.getElementById('undoButton');
undoBtn.onclick = function(e) {
  e.preventDefault();
  e.stopPropagation();
  countScoreAfter(board.undo);
};

var resetBtn = document.getElementById('resetButton');
resetBtn.onclick = function(e) {
  e.preventDefault();
  e.stopPropagation();
  reset();
};

reset();

function reset() {
  console.log('resetting');
  if (board) {
    board.fillBoardValues([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  }
  board = new Board($tiles);

  board.nextRound();
  countScoreAfter(board.nextRound);
}

function onKeyDown(e) {
  var event = e || window.event;
  event.preventDefault();
  event.stopPropagation();
  move(event.keyCode);

  function move(keyCode) {
    var moved = false;
    if (keyCode === 37 && board.isMoveLeftPossible()) {
      board.moveLeft();
      moved = true;
    } else if (keyCode === 38 && board.isMoveUpPossible()) {
      board.moveUp();
      moved = true;
    } else if (keyCode === 39 && board.isMoveRightPossible()) {
      board.moveRight();
      moved = true;
    } else if (keyCode === 40 && board.isMoveDownPossible()) {
      board.moveDown();
      moved = true;
    }

    if (keyCode >= 37 && keyCode <= 40) {
      if (board.isGameOver()) {
        alert('game over!');
      } else if (moved) {
        countScoreAfter(board.nextRound);
      }
    }
  }
}

function countScoreAfter(fn) {
  fn.call(board);
  var score = board.getScore();
  $currentScore.innerHTML = score;
}

document.board = board;
