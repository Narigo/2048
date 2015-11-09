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

  tile.className = 'tile';
  tile.classList.add('number-' + number);
  tile.innerHTML = number;

  this._gameOver = checkGameOver(this);
};

Board.prototype.getTile = function (id) {
  return this._board[id % 4][Math.floor(id / 4)];
};

Board.prototype.isMoveLeftPossible = function () {
  var tile1, tile2, x, y;
  for (y = 0; y < 4; y++) {
    x = 0;
    tile1 = this.getTile(y * 4 + x);
    for (x = 1; x < 4; x++) {
      tile2 = this.getTile(y * 4 + x);
      if (
        (tile1.gameData.value === 0 && tile2.gameData.value !== 0)
        || (tile1.gameData.value !== 0 && tile1.gameData.value === tile2.gameData.value)
      ) {
        return true;
      }
      tile1 = tile2;
    }
  }
  return false;
};

Board.prototype.isMoveRightPossible = function () {
  var tile1, tile2, x, y;
  for (y = 0; y < 4; y++) {
    x = 3;
    tile1 = this.getTile(y * 4 + x);
    for (x = 2; x >= 0; x--) {
      tile2 = this.getTile(y * 4 + x);
      if (
        (tile1.gameData.value === 0 && tile2.gameData.value !== 0)
        || (tile1.gameData.value !== 0 && tile1.gameData.value === tile2.gameData.value)
      ) {
        return true;
      }
      tile1 = tile2;
    }
  }
  return false;
};

Board.prototype.isMoveUpPossible = function () {
  var tile1, tile2, x, y;
  for (x = 0; x < 4; x++) {
    y = 0;
    tile1 = this.getTile(y * 4 + x);
    for (y = 1; y < 4; y++) {
      tile2 = this.getTile(y * 4 + x);
      if (
        (tile1.gameData.value === 0 && tile2.gameData.value !== 0)
        || (tile1.gameData.value !== 0 && tile1.gameData.value === tile2.gameData.value)
      ) {
        return true;
      }
      tile1 = tile2;
    }
  }
  return false;
};

Board.prototype.isMoveDownPossible = function () {
  var tile1, tile2, x, y;
  for (x = 0; x < 4; x++) {
    y = 3;
    tile1 = this.getTile(y * 4 + x);
    for (y = 2; y >= 0; y--) {
      tile2 = this.getTile(y * 4 + x);
      if (
        (tile1.gameData.value === 0 && tile2.gameData.value !== 0)
        || (tile1.gameData.value !== 0 && tile1.gameData.value === tile2.gameData.value)
      ) {
        return true;
      }
      tile1 = tile2;
    }
  }
  return false;
};

Board.prototype.isMoveXPossible = function () {
  return this.isMoveLeftPossible() || this.isMoveRightPossible();
};

Board.prototype.isMoveYPossible = function () {
  return this.isMoveUpPossible() || this.isMoveDownPossible();
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

        // current tile not empty
        if (isEmptyTile(tile)) {
          this.moveTile(this._board[x][y], tile);
        } else if (tile.gameData.value === this._board[x][y].gameData.value) {
          this.mergeTile(this._board[x][y], tile);
          tile = this._board[x][y];
        } else {
          break;
        }
      }
    }
  }
};

Board.prototype.moveLeft = function () {
  var mostLeftX, tile, x, y;
  for (y = 0; y < 4; y++) {
    for (mostLeftX = 0; mostLeftX <= 3; mostLeftX++) {
      tile = this._board[mostLeftX][y];
      for (x = mostLeftX + 1; x <= 3; x++) {
        if (isEmptyTile(this._board[x][y])) {
          continue;
        }

        // current tile not empty
        if (isEmptyTile(tile)) {
          this.moveTile(this._board[x][y], tile);
        } else if (tile.gameData.value === this._board[x][y].gameData.value) {
          this.mergeTile(this._board[x][y], tile);
          tile = this._board[x][y];
        } else {
          break;
        }
      }
    }
  }
};

Board.prototype.moveUp = function () {
  var topY, tile, x, y;
  for (x = 0; x < 4; x++) {
    for (topY = 0; topY <= 3; topY++) {
      tile = this._board[x][topY];
      for (y = topY + 1; y <= 3; y++) {
        if (isEmptyTile(this._board[x][y])) {
          continue;
        }

        // current tile not empty
        if (isEmptyTile(tile)) {
          this.moveTile(this._board[x][y], tile);
        } else if (tile.gameData.value === this._board[x][y].gameData.value) {
          this.mergeTile(this._board[x][y], tile);
          tile = this._board[x][y];
        } else {
          break;
        }
      }
    }
  }
};

Board.prototype.moveDown = function () {
  var bottomY, tile, x, y;
  for (x = 0; x < 4; x++) {
    for (bottomY = 3; bottomY >= 0; bottomY--) {
      tile = this._board[x][bottomY];
      for (y = bottomY - 1; y >= 0; y--) {
        if (isEmptyTile(this._board[x][y])) {
          continue;
        }

        // current tile not empty
        if (isEmptyTile(tile)) {
          this.moveTile(this._board[x][y], tile);
        } else if (tile.gameData.value === this._board[x][y].gameData.value) {
          this.mergeTile(this._board[x][y], tile);
          tile = this._board[x][y];
        } else {
          break;
        }
      }
    }
  }
};

Board.prototype.isGameOver = function () {
  return this._gameOver;
};

Board.prototype.mergeTile = function (a, b) {
  this.fillTile(b, b.gameData.value + a.gameData.value);
  emptyTile(a);
};

Board.prototype.moveTile = function (a, b) {
  this.fillTile(b, a.gameData.value);
  emptyTile(a);
};

function isEmptyTile(tile) {
  return tile.gameData.value === 0;
}

function emptyTile(tile) {
  tile.classList.remove('number-' + tile.gameData.value);
  tile.innerHTML = '';
  tile.gameData.filled = false;
  tile.gameData.value = 0;
}

function checkGameOver(board) {
  return !(board.isMoveXPossible() || board.isMoveYPossible());
}

module.exports = Board;
