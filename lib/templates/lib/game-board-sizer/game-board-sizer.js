const GameBoardSizerTemplate = require('./game-board-sizer.template');
const elParser = require('../../../helpers/el_parser');

module.exports = GameBoardSizer = {

  render(app, data, attachTo ="body") {
      var object = document.querySelector(attachTo);
      
      object.append(elParser(GameBoardSizerTemplate()));
      //object.innerHTML = GameBoardSizerTemplate();

  },

  attachEvents(app, data, target = ".gameboard") {
    var targetObject = document.querySelector(target);
    document.querySelector('#game_board_sizer').addEventListener('change', function() {
      targetObject.style.transform = `scale(${(document.querySelector('#game_board_sizer').value/100)})`;
    });
  }

}