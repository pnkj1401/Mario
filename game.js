import raylib from "raylib";
import Canvas from "./canvas.js";

export default class Game {

  /** @type {raylib.Camera2D} */
  camera = raylib.Camera2D();

  /** @param {Canvas} canvas */
  constructor(canvas) {
    this.canvas = canvas;

    this.camera.target = raylib.Vector2Zero();
    this.camera.offset = this.canvas.center;
    this.camera.rotation = 0;
    this.camera.zoom = 1;

  }

  run() {

    while(!raylib.WindowShouldClose()) {

      // const desiredFPS = raylib.IsKeyDown(raylib.KEY_F) ? 60 : 1;
      // raylib.SetTargetFPS(desiredFPS);

      const deltaTime = raylib.GetFrameTime();
      this.update(deltaTime * 1000);

      raylib.BeginDrawing();
      raylib.ClearBackground(this.canvas.backgroundColor);

      // raylib.BeginMode2D(this.camera);

      this.render();

      // raylib.EndMode2D();

      raylib.EndDrawing();

    }

    raylib.CloseWindow();

  }


  handleEvents() {
   this.player.handleEvents();
  }

  update() {
  }

  render() {
  }
};