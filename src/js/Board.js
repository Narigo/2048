function Board(tiles) {
  var self = this;
  this._board = [];
  this._gameOver = false;

  [].map.call(tiles, function (tile) {
    var ids = /^tile-(\d)(\d)$/.exec(tile.id);
    tile.gameData = {
      filled : false,
      x : parseInt(ids[2]),
      y : parseInt(ids[1]),
      id : tile.id,
      value : 0
    };
    self._board[ids[2]] = self._board[ids[2]] || [];
    self._board[ids[2]][ids[1]] = tile;
  });
}

Board.prototype.getEmptyCells = function () {
  var emptyCells = [];
  var x, y;

  for (x = 0; x < this._board.length; x++) {
    for (y = 0; y < this._board[x].length; y++) {
      if (!this._board[x][y].gameData.filled) {
        emptyCells.push(this._board[x][y]);
      }
    }
  }

  return emptyCells;
};

Board.prototype.nextRound = function () {
  var emptyCells = this.getEmptyCells();
  if (emptyCells.length === 0) {
    this._gameOver = true;
    return alert('game over');
  }

  var randomCellIdx = Math.floor(Math.random() * emptyCells.length);
  var twoOrFour = Math.random() >= 0.75 ? 4 : 2;
  this.fillTile(emptyCells[randomCellIdx], twoOrFour);
};

Board.prototype.fillTile = function (tile, number) {
  tile.gameData.filled = true;
  tile.gameData.value = number;

  tile.classList.remove();
  tile.classList.add('number-' + number);
  tile.innerHTML = number;

  this._gameOver = checkGameOver(this);
};

Board.prototype.getTile = function (id) {
  return this._board[id % 4][Math.floor(id / 4)];
};

Board.prototype.isMoveXPossible = function () {
  var oldTile;
  var data, i, oldData, tile;
  for (i = 0; i < 16; i++) {
    tile = this.getTile(i);
    if (oldTile) {
      oldData = oldTile.gameData;
      data = tile.gameData;
      if (oldData.value > 0 && data.y === oldData.y && (data.value === oldData.value || data.value === 0)) {
        return true;
      }
    }
    oldTile = tile;
  }
  return false;
};

Board.prototype.isMoveYPossible = function () {
  var oldTile;
  var data, i, oldData, tile;
  for (i = 0; i < 16; i++) {
    tile = this.getTile((i * 4) % 15);
    if (oldTile) {
      oldData = oldTile.gameData;
      data = tile.gameData;
      if (oldData.value > 0 && data.x === oldData.x && (data.value === oldData.value || data.value === 0)) {
        return true;
      }
    }
    oldTile = tile;
  }
  return false;
};

Board.prototype.moveRight = function () {
  var mostRightX, tile, x, y;
  for (y = 0; y < 4; y++) {
    for (mostRightX = 3; mostRightX >= 0; mostRightX--) {
      tile = this._board[mostRightX][y];
      for (x = mostRightX - 1; x >= 0; x--) {
        if (isEmptyTile(this._board[x][y])) {
          continue;
        }

        if (isEmptyTile(tile)) {
          mergeTile(this._board[x][y], tile);
        } else if (tile.gameData.value === this._board[x][y].gameData.value) {
          mergeTile(this._board[x][y], tile);
          tile = this._board[x][y];
        } else if (x < mostRightX - 1 && tile.gameData.value === this._board[x][y].gameData.value) {
          mergeTile(this._board[x][y], this._board[mostRightX - 1][y]);
          tile = this._board[mostRightX - 1][y];
        } else if (x < mostRightX - 1 && isEmptyTile(tile)) {
          moveTile(this._board[x][y], this._board[mostRightX - 1][y]);
          tile = this._board[mostRightX - 1][y];
        }
      }
    }
  }
};

Board.prototype.isGameOver = function () {
  return this._gameOver;
};

function isEmptyTile(tile) {
  return tile.gameData.value === 0;
}

function mergeTile(a, b) {
  b.gameData.value = b.gameData.value + a.gameData.value;
  b.innerHTML = b.gameData.value;
  emptyTile(a);
}

function moveTile(a, b) {
  b.gameData.value = a.gameData.value;
  b.innerHTML = b.gameData.value;
  emptyTile(a);
}

function emptyTile(tile) {
  tile.innerHTML = '';
  tile.gameData.value = 0;
}

function checkGameOver(board) {
  return !(board.isMoveXPossible() || board.isMoveYPossible());
}

module.exports = Board;
