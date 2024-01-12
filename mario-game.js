import raylib from "raylib";
import Game from "./game.js";
import Canvas from "./canvas.js";
import TileMap, { Tile } from "./map.js";
import Player from "./player.js";
import { PhysicsWorld } from "./physics.js";
import Matter from "matter-js";
import { using } from "./util.js";

const screenWidth = 1000;
const screenHeight = 700;

const colorDataMap = {
  "0_0_0_0": 0,
  "64_64_64_255": 1,
  "127_51_0_255": 2,
  "255_0_220_255": 3,
  "218_255_127_255": 4,
  "76_255_0_255": 5,
  "255_216_0_255": 6
};

export default class MarioGame extends Game {

  constructor() {
    const canvas = new Canvas(screenWidth, screenHeight, {
      title: "Mario Game",
      backgroundColor: raylib.SKYBLUE
    });
    super(canvas);
    this.physicsWorld = new PhysicsWorld();
    Matter.Composite.translate(this.physicsWorld.engine.world, {
      x: - screenWidth / 2,
      y: - screenHeight / 2
    });
    this.camera.zoom = 1.75;
    this.camera.target.y += 300;
    Tile.setTextureData({
      0: null,
      1: Canvas.loadTexture("groundstone.png"),
      2: Canvas.loadTexture("brick.png"),
      3: Canvas.loadTexture("stone.png"),
      4: Canvas.loadTexture("questionmark.png"),
      5: Canvas.loadTexture("pipe.png"),
      6: Canvas.loadTexture("coin.png")
    });
    this.tileMap = TileMap.loadFromImageColors("mario1.png", colorDataMap, tile => {
      using(tile.physicsBody, body => this.physicsWorld.addBody(body));
    });
    this.player = new Player(this, 400, 100, Tile.size - 2, Canvas.loadTexture("coin.png"));
    console.log(this.tileMap);
    this.physicsWorld.addBody(this.player.physicsBody);
    // this.physicsWorld.addBody(PhysicsWorld.createBody("rectangle", 0, 300, screenWidth, 100, {
    //   isStatic: true
    // }));
  }

  update(deltaTime) {
    console.log(deltaTime)
    this.physicsWorld.update(deltaTime);
    this.player.update(deltaTime);
  }

  render() {
    this.physicsWorld.render();
    this.tileMap.render();
    this.player.render();
    // raylib.DrawRectangle(0, 300, screenWidth, 100, raylib.GREEN);
  }

};