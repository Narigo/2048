var defaults = {
  maxUndo : 20
};

function Board(tiles, options) {
  var self = this;
  var config = options || defaults;
  this._board = [];
  this._history = [];
  this._points = 0;
  this._maxHistory = config.maxUndo || defaults.maxUndo;

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
    return false;
  }

  var randomCellIdx = Math.floor(Math.random() * emptyCells.length);
  var twoOrFour = Math.random() >= 0.75 ? 4 : 2;
  this.fillTile(emptyCells[randomCellIdx], twoOrFour);
  return true;
};

Board.prototype.fillTile = function (tile, number) {
  this._points += number;
  tile.gameData.filled = true;
  tile.gameData.value = number;

  tile.className = 'tile';
  if (number === 0) {
    tile.innerHTML = '';
  } else {
    tile.classList.add('number-' + number);
    tile.innerHTML = number;
  }
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
      if (checkMovePossible(tile1, tile2)) {
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
      if (checkMovePossible(tile1, tile2)) {
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
      if (checkMovePossible(tile1, tile2)) {
        return true;
      }
      tile1 = tile2;
    }
  }
  return false;
};

function checkMovePossible(tile1, tile2) {
  return (tile1.gameData.value === 0 && tile2.gameData.value !== 0)
    || (tile1.gameData.value !== 0 && tile1.gameData.value === tile2.gameData.value);
}

Board.prototype.isMoveDownPossible = function () {
  var tile1, tile2, x, y;
  for (x = 0; x < 4; x++) {
    y = 3;
    tile1 = this.getTile(y * 4 + x);
    for (y = 2; y >= 0; y--) {
      tile2 = this.getTile(y * 4 + x);
      if (checkMovePossible(tile1, tile2)) {
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
  this._checkIfPossibleAndMove({
    xMod : -1,
    yMod : 0,
    axis : 'y',
    axis2 : 'x',
    direction : 'Right'
  });
};

Board.prototype.moveLeft = function () {
  this._checkIfPossibleAndMove({
    xMod : 1,
    yMod : 0,
    axis : 'y',
    axis2 : 'x',
    direction : 'Left'
  });
};

Board.prototype.moveUp = function () {
  this._checkIfPossibleAndMove({
    xMod : 0,
    yMod : 1,
    axis : 'x',
    axis2 : 'y',
    direction : 'Up'
  });
};

Board.prototype.moveDown = function () {
  this._checkIfPossibleAndMove({
    xMod : 0,
    yMod : -1,
    axis : 'x',
    axis2 : 'y',
    direction : 'Down'
  });
};

Board.prototype.isGameOver = function () {
  return !((this.isMoveXPossible() || this.isMoveYPossible()) || this.getEmptyCells().length > 0);
};

Board.prototype.mergeTile = function (a, b) {
  this.fillTile(b, b.gameData.value + a.gameData.value);
  emptyTile(a);
};

Board.prototype.undo = function () {
  if (this._history.length > 0) {
    var oldState = this._history[this._history.length - 1];
    this._history = this._history.slice(0, this._history.length - 1);
    this.fillBoardValues(oldState.board);
    this._points = oldState.points;
  }
};

Board.prototype.getCurrentState = function () {
  var board = [];
  for (var y = 0; y < this._board.length; y++) {
    board[y] = [];
    for (var x = 0; x < this._board[y].length; x++) {
      board[y][x] = this._board[x][y].gameData.value;
    }
  }
  return {board : board, points : this._points};
};

Board.prototype.fillBoardValues = function (filledBoard) {
  for (var y = 0; y < filledBoard.length; y++) {
    for (var x = 0; x < filledBoard[y].length; x++) {
      var id = y * 4 + x;
      this.fillTile(this._board[id % 4][Math.floor(id / 4)], filledBoard[y][x]);
    }
  }
};

Board.prototype._checkIfPossibleAndMove = function (data) {
  if (this['isMove' + data.direction + 'Possible']()) {
    if (this._history.length >= this._maxHistory) {
      this._history.shift();
    }
    this._history.push(this.getCurrentState());
    this._moveData(data);
  }
};

Board.prototype._moveData = function (data) {
  for (data[data.axis] = 0; data[data.axis] < 4; data[data.axis] += 1) {
    if (data.xMod + data.yMod < 0) {
      for (data[data.axis2 + '2'] = 3; data[data.axis2 + '2'] >= 0; data[data.axis2 + '2'] += -1) {
        this._moveInner(data, function (data) {
          return data[data.axis2] >= 0;
        });
      }
    } else {
      for (data[data.axis2 + '2'] = 0; data[data.axis2 + '2'] < 4; data[data.axis2 + '2'] += 1) {
        this._moveInner(data, function (data) {
          return data[data.axis2] < 4;
        });
      }
    }
  }
};

Board.prototype._moveInner = function (data, check) {
  data[data.axis + '2'] = data[data.axis];
  data.x = data.x2 + data.xMod;
  data.y = data.y2 + data.yMod;
  data.tile = this._board[data.x2][data.y2];

  for (; check(data); data.x += data.xMod, data.y += data.yMod) {
    if (isEmptyTile(this._board[data.x][data.y])) {
      continue;
    }

    // current tile not empty
    if (isEmptyTile(data.tile)) {
      this.mergeTile(this._board[data.x][data.y], data.tile);
    } else if (data.tile.gameData.value === this._board[data.x][data.y].gameData.value) {
      this.mergeTile(this._board[data.x][data.y], data.tile);
      data.tile = this._board[data.x][data.y];
    } else {
      break;
    }
  }
};

Board.prototype.getPoints = function () {
  return this._points;
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

module.exports = Board;
