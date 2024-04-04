import raylib from "raylib";
import Game from "./game.js";
import Canvas from "./canvas.js";
import TileMap, { Tile } from "./map.js";
import Player from "./player.js";
import { PhysicsWorld } from "./physics.js";
import Matter from "matter-js";
import { using } from "./util.js";
import Entity from "./entity.js";
import { AnimationState } from "./animation.js";

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

export class Category {
  /** @readonly */ static GROUND = 0x0001;
  /** @readonly */ static PLAYER = 0x0002;
  /** @readonly */ static COIN = 0x0004;
  /** @readonly */ static MUSHROOM = 0x0008;
};

export class PhysicsEntity extends Entity {

  #texture;
  #body;
  #source;
  #destination;
  #origin = { x: 0, y: 0 };
  #direction = 20;

  /**
   * @param {MarioGame} game
   * @param {raylib.Texture} texture
   * @param {Matter.Body} physicsBody
   * @param {{ width: number; height: number }} dimensions
   */
  constructor(game, texture, physicsBody, dimensions) {
    super(game);
    this.#body = physicsBody;
    this.#texture = texture;
    this.#source = {
      x: 0,
      y: 0,
      width: this.#texture.width,
      height: this.#texture.height
    };
    this.#destination = {
      x: physicsBody.position.x,
      y: physicsBody.position.y,
      width: dimensions.width,
      height: dimensions.height
    };
    game.physicsWorld.addBody(this.#body);
    Matter.Events.on(this.game.physicsWorld.engine, "collisionStart", event => {
      for(const pair of event.pairs) {
        if(pair.bodyB !== this.#body) {
          continue;
        }
        // console.log(pair.bodyA.collisionFilter.category, pair.bodyB.collisionFilter.category)
        if(pair.bodyA.collisionFilter.category === Category.PLAYER) {
          this.game.removeEntity(this);
          this.destroy();
          this.game.player.createBigBody();
          continue;
        }
        if(pair.bodyA.collisionFilter.category === Category.GROUND) {
          if(Math.round(pair.collision.normal.x) === 0) {
            continue;
          }
          this.#direction *= -1;
        }
      }
    });
  }

  get body() {
    return this.#body;
  }

  destroy() {
    this.game.physicsWorld.removeBody(this.#body);
    this.#body = null;
  }

  update(deltaTime) {
    Matter.Body.applyForce(this.#body, {
      x: this.#body.position.x + this.#source.width / 2,
      y: this.#body.position.y + this.#source.height / 2
    }, { x: Math.sign(this.#direction), y: 0 });
  }

  render() {
    this.#destination.x = this.#body.position.x;
    this.#destination.y = this.#body.position.y;
    raylib.DrawTexturePro(this.#texture, this.#source, this.#destination, this.#origin, 0, raylib.WHITE);
  }

};

export default class MarioGame extends Game {

  /** @type {Entity[]} */
  #entities = [];

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
    this.player = new Player(this, 400, 100, Tile.size - 2);
    this.physicsWorld.addBody(this.player.physicsBody);
    // this.physicsWorld.addBody(PhysicsWorld.createBody("rectangle", 0, 300, screenWidth, 100, {
    //   isStatic: true
    // }));
  }

  update(deltaTime) {
    this.physicsWorld.update(deltaTime);
    for(const entity of this.#entities) {
      entity.update(deltaTime);
    }
    this.player.update(deltaTime);
  }

  render() {
    this.physicsWorld.render();
    this.tileMap.render();
    for(const entity of this.#entities) {
      entity.render();
    }
    this.player.render();
    // raylib.DrawRectangle(0, 300, screenWidth, 100, raylib.GREEN);
  }

  /** @param {Entity} entity */
  addEntity(entity) {
    this.#entities.push(entity);
  }

  /** @param {Entity} entity */
  removeEntity(entity) {
    const index = this.#entities.indexOf(entity);
    if(index > -1) {
      this.#entities.splice(index, 1);
    }
  }
};