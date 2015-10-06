var Board = require('../src/js/Board');

describe('Board', function () {

  var board;

  // inject the HTML fixture for the tests
  beforeEach(function () {
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

  it('is over when it fails to add another tile', function () {
    expect(board.getEmptyCells().length).toBe(16);
    for (var i = 1; i < 17; i++) {
      board.nextRound();
      expect(board.getEmptyCells().length).toBe(16 - i);
    }
    expect(board.getEmptyCells().length).toBe(0);
    board.nextRound();
    expect(board.getEmptyCells().length).toBe(0);
    expect(board.isGameOver()).toBe(true);
  });

  it('is over if the whole board is filled and no possible moves detected', function () {
    expect(board.getEmptyCells().length).toBe(16);
    board.nextRound();
    expect(board.getEmptyCells().length).toBe(15);
  });
});
