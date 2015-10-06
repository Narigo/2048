function Board(tiles) {
  var self = this;
  this._board = [];
  this._gameOver = false;

  [].map.call(tiles, function (tile) {
    var ids = /^tile-(\d)(\d)$/.exec(tile.id);
    tile.gameData = {
      filled : false,
      x : ids[2],
      y : ids[1],
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
};

Board.prototype.isGameOver = function() {
  return this._gameOver;
};

module.exports = Board;
