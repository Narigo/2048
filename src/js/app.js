var Board = require('./Board');

var $tiles = document.querySelectorAll('.tile');
var $currentScore = document.querySelectorAll('.currentScore');
var $highScore = document.querySelectorAll('.highScore');
var $gameOver = document.getElementById('game-over-overlay');
var board, currentHighScore;

document.onkeydown = onKeyDown;
$gameOver.addEventListener('click', hideGameOverOverlay);

var undoBtn = document.getElementById('undoButton');
undoBtn.onclick = function (e) {
  e.preventDefault();
  e.stopPropagation();
  board.undo();
};

var resetBtn = document.getElementById('resetButton');
resetBtn.onclick = function (e) {
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
  setCurrentScore(0, localStorage.getItem('highScore') || 0);
  board = new Board($tiles, {
    onScoreUpdate : setCurrentScore,
    highScore : currentHighScore
  });

  board.nextRound();
  board.nextRound();
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
        showGameOverOverlay();
      } else if (moved) {
        board.nextRound();
      }
    }
  }
}

function showGameOverOverlay() {
  $gameOver.classList.remove('hidden');
}

function hideGameOverOverlay() {
  $gameOver.classList.add('hidden');
}

function setCurrentScore(score, highest) {
  currentHighScore = highest;
  localStorage.setItem('highScore', highest);
  Array.prototype.forEach.call($currentScore, function(e) {
    e.innerHTML = score;
  });
  Array.prototype.forEach.call($highScore, function(e) {
    e.innerHTML = highest;
  });
}

document.board = board;
