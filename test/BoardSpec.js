var Board = require('../src/js/Board');

describe('Board', function () {

  var board;

  // inject the HTML fixture for the tests
  var fixture = '<div id="game">' +
    '<div class="row">' +
    '<div id="tile-00" class="tile"></div>' +
    '<div id="tile-01" class="tile"></div>' +
    '<div id="tile-02" class="tile"></div>' +
    '<div id="tile-03" class="tile"></div>' +
    '</div>' +
    '<div class="row">' +
    '<div id="tile-10" class="tile"></div>' +
    '<div id="tile-11" class="tile"></div>' +
    '<div id="tile-12" class="tile"></div>' +
    '<div id="tile-13" class="tile"></div>' +
    '</div>' +
    '<div class="row">' +
    '<div id="tile-20" class="tile"></div>' +
    '<div id="tile-21" class="tile"></div>' +
    '<div id="tile-22" class="tile"></div>' +
    '<div id="tile-23" class="tile"></div>' +
    '</div>' +
    '<div class="row">' +
    '<div id="tile-30" class="tile"></div>' +
    '<div id="tile-31" class="tile"></div>' +
    '<div id="tile-32" class="tile"></div>' +
    '<div id="tile-33" class="tile"></div>' +
    '</div>' +
    '</div>';

  document.body.insertAdjacentHTML('afterbegin', fixture);

  beforeEach(function () {
    var tiles = document.body.querySelectorAll('.tile');
    [].map.call(tiles, function (tile) {
      tile.className = 'tile';
      tile.innerHTML = '';
      return tile;
    });
    var game = document.querySelectorAll('.tile');
    board = new Board(game);
  });

  it('is empty in the beginning', function () {
    expect(board.getEmptyCells().length).toBe(16);
  });

  it('fills another cell when calling nextRound', function () {
    expect(board.getEmptyCells().length).toBe(16);
    board.nextRound();
    expect(board.getEmptyCells().length).toBe(15);
  });

  it('always fills another cell when calling nextRound', function () {
    expect(board.getEmptyCells().length).toBe(16);
    for (var i = 1; i < 17; i++) {
      board.nextRound();
      expect(board.getEmptyCells().length).toBe(16 - i);
    }
  });

  it('can return a tile by id', function () {
    var tile;
    for (var i = 0; i < 16; i++) {
      tile = board.getTile(i);
      expect(tile.gameData.x).toBe(i % 4);
      expect(tile.gameData.y).toBe(Math.floor(i / 4));
    }
  });

  it('can tell whether a move on x-axis is possible', function () {
    board.fillTile(board.getTile(0), 2);
    expect(board.isMoveXPossible()).toBe(true);
    board.fillTile(board.getTile(1), 4);
    board.fillTile(board.getTile(2), 8);
    board.fillTile(board.getTile(3), 16);
    expect(board.isMoveXPossible()).toBe(false);
    board.fillTile(board.getTile(1), 2);
    expect(board.isMoveXPossible()).toBe(true);
  });

  it('can tell whether a move on y-axis is possible', function () {
    board.fillTile(board.getTile(0), 2);
    expect(board.isMoveYPossible()).toBe(true);
    board.fillTile(board.getTile(4), 4);
    board.fillTile(board.getTile(8), 8);
    board.fillTile(board.getTile(12), 16);
    expect(board.isMoveYPossible()).toBe(false);
    board.fillTile(board.getTile(4), 2);
    expect(board.isMoveYPossible()).toBe(true);
  });

  it('is over when no more moves are possible and the board is not empty', function () {
    expect(board.getEmptyCells().length).toBe(16);
    expect(board.isMoveXPossible()).toBe(false);
    expect(board.isMoveYPossible()).toBe(false);
    expect(board.isGameOver()).toBe(false);
    for (var i = 1; i < 17; i++) {
      board.fillTile(board.getTile(i - 1), Math.pow(2, i));
    }
    expect(board.isMoveXPossible()).toBe(false);
    expect(board.isMoveYPossible()).toBe(false);
    expect(board.isGameOver()).toBe(true);
  });

  it('can merge two adjacent cells with the same value', function () {
    var y;
    for (y = 0; y < 16; y += 4) {
      board.fillTile(board.getTile(y + 2), 2);
      board.fillTile(board.getTile(y + 3), 2);
    }

    board.moveRight();

    for (y = 0; y < 16; y += 4) {
      expect(board.getTile(y + 2).gameData.value).toBe(0);
      expect(board.getTile(y + 3).gameData.value).toBe(4);
    }
  });

  it('moves full cells to empty cells', function () {
    var y;
    for (y = 0; y < 16; y += 4) {
      board.fillTile(board.getTile(y + 2), 2);
    }

    board.moveRight();

    for (y = 0; y < 16; y += 4) {
      expect(board.getTile(y + 2).gameData.value).toBe(0);
      expect(board.getTile(y + 3).gameData.value).toBe(2);
    }
  });

  it('moves full cells to the last empty cell', function () {
    var y;
    for (y = 0; y < 16; y += 4) {
      board.fillTile(board.getTile(y + 1), 2);
    }

    board.moveRight();

    for (y = 0; y < 16; y += 4) {
      expect(board.getTile(y + 1).gameData.value).toBe(0);
      expect(board.getTile(y + 3).gameData.value).toBe(2);
    }
  });

  it('moves full cells and does not merge if different values', function () {
    var y;
    for (y = 0; y < 16; y += 4) {
      board.fillTile(board.getTile(y + 1), 2);
      board.fillTile(board.getTile(y + 3), 4);
    }

    board.moveRight();

    for (y = 0; y < 16; y += 4) {
      expect(board.getTile(y).gameData.value).toBe(0);
      expect(board.getTile(y + 1).gameData.value).toBe(0);
      expect(board.getTile(y + 2).gameData.value).toBe(2);
      expect(board.getTile(y + 3).gameData.value).toBe(4);
    }
  });

  it('moves and merges full cells with same values', function () {
    var y;
    for (y = 0; y < 16; y += 4) {
      board.fillTile(board.getTile(y + 1), 2);
      board.fillTile(board.getTile(y + 3), 2);
    }

    board.moveRight();

    for (y = 0; y < 16; y += 4) {
      expect(board.getTile(y).gameData.value).toBe(0);
      expect(board.getTile(y + 1).gameData.value).toBe(0);
      expect(board.getTile(y + 2).gameData.value).toBe(0);
      expect(board.getTile(y + 3).gameData.value).toBe(4);
    }
  });

  it('moves and merges full cells with same values', function () {
    var y;
    for (y = 0; y < 16; y += 4) {
      board.fillTile(board.getTile(y), 2);
      board.fillTile(board.getTile(y + 1), 2);
      board.fillTile(board.getTile(y + 3), 4);
    }

    board.moveRight();

    for (y = 0; y < 16; y += 4) {
      expect(board.getTile(y).gameData.value).toBe(0);
      expect(board.getTile(y + 1).gameData.value).toBe(0);
      expect(board.getTile(y + 2).gameData.value).toBe(4);
      expect(board.getTile(y + 3).gameData.value).toBe(4);
    }
  });

  it('moves over empty cells and merges full cells with same values', function () {
    var y;
    for (y = 0; y < 16; y += 4) {
      board.fillTile(board.getTile(y), 2);
      board.fillTile(board.getTile(y + 2), 2);
      board.fillTile(board.getTile(y + 3), 4);
    }

    checkBoardValues([
      [2,0,2,4],
      [2,0,2,4],
      [2,0,2,4],
      [2,0,2,4]
    ]);

    board.moveRight();

    checkBoardValues([
      [0,0,4,4],
      [0,0,4,4],
      [0,0,4,4],
      [0,0,4,4]
    ]);
  });

  function checkBoardValues(expectedBoard) {
    for (var y = 0; y < expectedBoard.length; y++) {
      for (var x = 0; x < expectedBoard[y].length; x++) {
        expect(board._board[x][y].gameData.value).toBe(expectedBoard[y][x]);
      }
    }
  }
});
