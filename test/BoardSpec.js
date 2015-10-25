var Board = require('../src/js/Board');

describe('Board', function () {

  var board;
  var debug = false;

  var log = console.log;
  console.log = function () {
    if (debug) {
      log.apply(this, arguments);
    }
  };

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

  it('can tell whether a move on y-axis is possible', function () {
    fillBoardValues([
      [4, 0, 0, 0],
      [8, 4, 0, 0],
      [16, 2, 0, 4],
      [128, 8, 4, 0]
    ]);
    showBoard(board);
    expect(board.isMoveYPossible()).toBe(true);
    board.fillTile(board.getTile(15), 16);
    showBoard(board);
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

  it('has the correct amount of empty cells after left merge', function () {
    expect(board.getEmptyCells().length).toBe(16);

    board.fillTile(board.getTile(0), 2);
    board.fillTile(board.getTile(1), 2);
    expect(board.getEmptyCells().length).toBe(14);

    board.moveLeft();
    expect(board.getEmptyCells().length).toBe(15);
  });

  it('has the correct amount of empty cells after right merge', function () {
    expect(board.getEmptyCells().length).toBe(16);

    board.fillTile(board.getTile(0), 2);
    board.fillTile(board.getTile(1), 2);
    expect(board.getEmptyCells().length).toBe(14);

    board.moveRight();
    expect(board.getEmptyCells().length).toBe(15);
  });

  describe('Move/merge right', function () {

    it('can merge two adjacent cells with the same value', function () {
      fillBoardValues([
        [0, 0, 2, 2],
        [0, 2, 2, 0],
        [2, 2, 0, 0],
        [2, 2, 2, 2]
      ]);

      board.moveRight();

      checkBoardValues([
        [0, 0, 0, 4],
        [0, 0, 0, 4],
        [0, 0, 0, 4],
        [0, 0, 4, 4]
      ]);
    });

    it('moves full cells to the last empty cell', function () {
      fillBoardValues([
        [2, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 2]
      ]);

      board.moveRight();

      checkBoardValues([
        [0, 0, 0, 2],
        [0, 0, 0, 2],
        [0, 0, 0, 2],
        [0, 0, 0, 2]
      ]);
    });

    it('moves full cells and does not merge if different values', function () {
      fillBoardValues([
        [2, 4, 0, 0],
        [2, 0, 4, 0],
        [0, 2, 0, 4],
        [4, 0, 0, 2]
      ]);

      board.moveRight();

      checkBoardValues([
        [0, 0, 2, 4],
        [0, 0, 2, 4],
        [0, 0, 2, 4],
        [0, 0, 4, 2]
      ]);
    });

    it('moves and merges full cells with same values', function () {
      fillBoardValues([
        [2, 2, 2, 2],
        [4, 2, 2, 4],
        [0, 0, 2, 2],
        [2, 2, 0, 0]
      ]);

      board.moveRight();

      checkBoardValues([
        [0, 0, 4, 4],
        [0, 4, 4, 4],
        [0, 0, 0, 4],
        [0, 0, 0, 4]
      ]);
    });

    it('moves over empty cells and merges full cells with same values', function () {
      fillBoardValues([
        [2, 0, 2, 4],
        [4, 0, 4, 2],
        [2, 0, 2, 4],
        [2, 0, 0, 2]
      ]);

      board.moveRight();

      checkBoardValues([
        [0, 0, 4, 4],
        [0, 0, 8, 2],
        [0, 0, 4, 4],
        [0, 0, 0, 4]
      ]);
    });

    it('moves and merges a specified scenario correctly', function () {
      fillBoardValues([
        [0, 2, 2, 0],
        [4, 0, 4, 4],
        [4, 2, 2, 2],
        [2, 2, 2, 2]
      ]);

      board.moveRight();

      checkBoardValues([
        [0, 0, 0, 4],
        [0, 0, 4, 8],
        [0, 4, 2, 4],
        [0, 0, 4, 4]
      ]);
    });

  });

  describe('Move/merge left', function () {

    it('can merge two adjacent cells with the same value', function () {
      fillBoardValues([
        [2, 2, 0, 0],
        [0, 2, 2, 0],
        [0, 0, 2, 2],
        [2, 2, 2, 2]
      ]);

      board.moveLeft();

      checkBoardValues([
        [4, 0, 0, 0],
        [4, 0, 0, 0],
        [4, 0, 0, 0],
        [4, 4, 0, 0]
      ]);
    });

    it('moves full cells to the last empty cell', function () {
      fillBoardValues([
        [0, 0, 0, 2],
        [0, 0, 2, 0],
        [0, 2, 0, 0],
        [2, 0, 0, 0]
      ]);

      board.moveLeft();

      checkBoardValues([
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [2, 0, 0, 0]
      ]);
    });

    it('moves full cells and does not merge if different values', function () {
      fillBoardValues([
        [0, 0, 4, 2],
        [0, 4, 0, 2],
        [4, 0, 2, 0],
        [2, 0, 0, 4]
      ]);

      board.moveLeft();

      checkBoardValues([
        [4, 2, 0, 0],
        [4, 2, 0, 0],
        [4, 2, 0, 0],
        [2, 4, 0, 0]
      ]);
    });

    it('moves and merges full cells with same values', function () {
      fillBoardValues([
        [2, 2, 2, 2],
        [4, 2, 2, 4],
        [2, 2, 0, 0],
        [0, 0, 2, 2]
      ]);

      board.moveLeft();

      checkBoardValues([
        [4, 4, 0, 0],
        [4, 4, 4, 0],
        [4, 0, 0, 0],
        [4, 0, 0, 0]
      ]);
    });

    it('moves over empty cells and merges full cells with same values', function () {
      fillBoardValues([
        [4, 2, 0, 2],
        [2, 4, 0, 4],
        [4, 2, 0, 2],
        [2, 0, 0, 2]
      ]);

      board.moveLeft();

      checkBoardValues([
        [4, 4, 0, 0],
        [2, 8, 0, 0],
        [4, 4, 0, 0],
        [4, 0, 0, 0]
      ]);
    });

    it('moves and merges a specified scenario correctly', function () {
      fillBoardValues([
        [0, 2, 2, 0],
        [4, 0, 4, 4],
        [4, 2, 2, 2],
        [2, 2, 2, 2]
      ]);

      board.moveLeft();

      checkBoardValues([
        [4, 0, 0, 0],
        [8, 4, 0, 0],
        [4, 4, 2, 0],
        [4, 4, 0, 0]
      ]);
    });

  });

  describe('Move/merge up', function () {

    it('can merge two adjacent cells with the same value', function () {
      fillBoardValues([
        [2, 0, 0, 2],
        [2, 2, 0, 2],
        [0, 2, 2, 2],
        [0, 0, 2, 2]
      ]);

      board.moveUp();

      checkBoardValues([
        [4, 4, 4, 4],
        [0, 0, 0, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]);
    });

    it('moves full cells to the last empty cell', function () {
      fillBoardValues([
        [0, 0, 0, 2],
        [0, 0, 2, 0],
        [0, 2, 0, 0],
        [2, 0, 0, 0]
      ]);

      board.moveUp();

      checkBoardValues([
        [2, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]);
    });

    it('moves full cells and does not merge if different values', function () {
      fillBoardValues([
        [0, 0, 4, 2],
        [0, 4, 0, 0],
        [4, 0, 2, 0],
        [2, 2, 0, 4]
      ]);

      board.moveUp();

      checkBoardValues([
        [4, 4, 4, 2],
        [2, 2, 2, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]);
    });

    it('moves and merges full cells with same values', function () {
      fillBoardValues([
        [2, 4, 2, 0],
        [2, 2, 2, 0],
        [2, 2, 0, 2],
        [2, 4, 0, 2]
      ]);

      board.moveUp();

      checkBoardValues([
        [4, 4, 4, 4],
        [4, 4, 0, 0],
        [0, 4, 0, 0],
        [0, 0, 0, 0]
      ]);
    });

    it('moves over empty cells and merges full cells with same values', function () {
      fillBoardValues([
        [4, 2, 4, 2],
        [2, 4, 2, 0],
        [0, 0, 0, 0],
        [2, 4, 2, 2]
      ]);

      board.moveUp();

      checkBoardValues([
        [4, 2, 4, 4],
        [4, 8, 4, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]);
    });

    it('moves and merges a specified scenario correctly', function () {
      fillBoardValues([
        [0, 4, 4, 2],
        [2, 0, 2, 2],
        [2, 4, 2, 2],
        [0, 4, 2, 2]
      ]);

      board.moveUp();

      checkBoardValues([
        [4, 8, 4, 4],
        [0, 4, 4, 4],
        [0, 0, 2, 0],
        [0, 0, 0, 0]
      ]);
    });

  });

  describe('Move/merge down', function () {

    it('can merge two adjacent cells with the same value', function () {
      fillBoardValues([
        [0, 0, 2, 2],
        [0, 2, 2, 2],
        [2, 2, 0, 2],
        [2, 0, 0, 2]
      ]);

      board.moveDown();

      checkBoardValues([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 4],
        [4, 4, 4, 4]
      ]);
    });

    it('moves full cells to the last empty cell', function () {
      fillBoardValues([
        [2, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 2]
      ]);

      board.moveDown();

      checkBoardValues([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 2, 2, 2]
      ]);
    });

    it('moves full cells and does not merge if different values', function () {
      fillBoardValues([
        [2, 2, 0, 4],
        [4, 0, 2, 0],
        [0, 4, 0, 0],
        [0, 0, 4, 2]
      ]);

      board.moveDown();

      checkBoardValues([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 2, 2, 4],
        [4, 4, 4, 2]
      ]);
    });

    it('moves and merges full cells with same values', function () {
      fillBoardValues([
        [2, 4, 0, 2],
        [2, 2, 0, 2],
        [2, 2, 2, 0],
        [2, 4, 2, 0]
      ]);

      board.moveDown();

      checkBoardValues([
        [0, 0, 0, 0],
        [0, 4, 0, 0],
        [4, 4, 0, 0],
        [4, 4, 4, 4]
      ]);
    });

    it('moves over empty cells and merges full cells with same values', function () {
      fillBoardValues([
        [2, 4, 2, 2],
        [0, 0, 0, 0],
        [2, 4, 2, 0],
        [4, 2, 4, 2]
      ]);

      board.moveDown();

      checkBoardValues([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [4, 8, 4, 0],
        [4, 2, 4, 4]
      ]);
    });

    it('moves and merges a specified scenario correctly', function () {
      fillBoardValues([
        [0, 4, 2, 2],
        [2, 4, 2, 2],
        [2, 0, 2, 2],
        [0, 4, 4, 2]
      ]);

      board.moveDown();

      checkBoardValues([
        [0, 0, 0, 0],
        [0, 0, 2, 0],
        [0, 4, 4, 4],
        [4, 8, 4, 4]
      ]);
    });

  });

  function fillBoardValues(filledBoard) {
    var str = 'filling board';
    for (var y = 0; y < filledBoard.length; y++) {
      str += '\n';
      for (var x = 0; x < filledBoard[y].length; x++) {
        board.fillTile(board.getTile(y * 4 + x), filledBoard[y][x]);
        str += ' ' + board._board[x][y].gameData.value;
      }
    }
    console.log(str);
  }

  function showBoard(board) {
    var str = 'showing board';
    for (var y = 0; y < board._board.length; y++) {
      str += '\n';
      for (var x = 0; x < board._board[y].length; x++) {
        str += ' ' + board._board[x][y].gameData.value;
      }
    }
    console.log(str);
  }

  function checkBoardValues(expectedBoard) {
    var str = 'checking board';
    var expected = 'expected board';
    for (var y = 0; y < expectedBoard.length; y++) {
      str += '\n';
      expected += '\n';
      for (var x = 0; x < expectedBoard[y].length; x++) {
        expected += ' ' + expectedBoard[y][x];
        str += ' ' + board._board[x][y].gameData.value;
        expect(board._board[x][y].gameData.value).toBe(expectedBoard[y][x]);
      }
    }
    console.log(expected);
    console.log(str);
  }
});
