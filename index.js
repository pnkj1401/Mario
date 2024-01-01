const Game = require('./game');
const r = require('raylib');

const screenWidth = 1000;
const screenHeight = 700;
const game = new Game(screenWidth, screenHeight, 'name');

while (!game.getIsClosed()) {
  r.BeginDrawing();
  r.ClearBackground(r.SKYBLUE);

  r.BeginMode2D(game.camera);

  game.handleEvents();
  game.update();
  game.render();

  r.EndMode2D();

  r.EndDrawing();
}

r.CloseWindow();
