// let playerpath=r.LoadImage("./assets/Mario.png");
// let Bigwalkpath=r.LoadImage("./assets/Bigwalk.png");

import raylib from "raylib";
import Vector2 from "./vector2.js";
import { PhysicsBody } from "./physics.js";
import Entity from "./entity.js";
import { Tile } from "./map.js";
import Animation, { AnimationState } from "./animation.js";
import Canvas from "./canvas.js";
import { using } from "./util.js";


export default class Player extends Entity {
  #events = {
    moveLeft: false,
    moveRight: false,
    jump: false,
    crouch: false
  };
  constructor(game, x, y, size, texture) {
    super(game, x, y);
    game.camera.target = this.position;
    this.width = size;
    this.height = size;
    this.texture = texture;
    this.physicsBody = new PhysicsBody(this.position);
    this.newPosition = Vector2.zero();
    this.physicsBody.mass = 1;
    this.animation = new Animation({
      idleLeft: new AnimationState(Canvas.loadTexture("idle.png", { flipHorizontal: true }), 1),
      idleRight: new AnimationState(Canvas.loadTexture("idle.png"), 1),
      walkLeft: new AnimationState(Canvas.loadTexture("Mario.png", { flipHorizontal: true }), 3),
      walkRight: new AnimationState(Canvas.loadTexture("Mario.png"), 3)
    }, "idleRight", this.position, this.width, this.height, 6);
  }

  handleEvents() {
    this.#events.moveLeft = raylib.IsKeyDown(raylib.KEY_A) || raylib.IsKeyDown(raylib.KEY_LEFT);
    this.#events.moveRight = raylib.IsKeyDown(raylib.KEY_D) || raylib.IsKeyDown(raylib.KEY_RIGHT);
    this.#events.jump = raylib.IsKeyDown(raylib.KEY_SPACE) || raylib.IsKeyDown(raylib.KEY_W) || raylib.IsKeyDown(raylib.KEY_UP);
    this.#events.crouch = raylib.IsKeyDown(raylib.KEY_LEFT_CONTROL) || raylib.IsKeyDown(raylib.KEY_S)  || raylib.IsKeyDown(raylib.KEY_DOWN);
    // console.log(this.#events);
  }

  update(delta) {

    this.handleEvents();

    if(this.#events.moveLeft) {
      this.physicsBody.applyForce(delta, new Vector2(-1500, 0));
    }
    if(this.#events.moveRight) {
      this.physicsBody.applyForce(delta, new Vector2(1500, 0));
    }
    if(this.#events.jump) {
      this.physicsBody.applyForce(delta, new Vector2(0, -1500));
    }
    if(this.#events.crouch) {
      this.physicsBody.applyForce(delta, new Vector2(0, 1500));
    }

    this.newPosition = this.position.copy().add(Vector2.scaled(this.physicsBody.velocity, delta));
    const tiles = this.game.tileMap.getCollidingTiles(this.newPosition.x, this.newPosition.y, this.width, this.height);

    using(this.game.tileMap.get(tiles.columnStart, tiles.rowStart), function() {
      this.border.top = raylib.BLACK;
      this.border.left = raylib.BLACK;
    });

    using(this.game.tileMap.get(tiles.columnStart, tiles.rowEnd), function() {
      this.border.left = raylib.BLACK;
      this.border.bottom = raylib.BLACK;
    });

    using(this.game.tileMap.get(tiles.columnEnd, tiles.rowStart), function() {
      this.border.top = raylib.BLACK;
      this.border.right = raylib.BLACK;
    });

    using(this.game.tileMap.get(tiles.columnEnd, tiles.rowEnd), function() {
      this.border.right = raylib.BLACK;
      this.border.bottom = raylib.BLACK;
    });


    for(let column = tiles.columnStart; column <= tiles.columnEnd; column++) {
      const groundTile = this.game.tileMap.get(column, tiles.rowEnd);
      // console.log(this.position, column, tiles.rowEnd, tile?.data ?? null);
      if(groundTile !== null && groundTile.data > 0) {
        groundTile.border.top = raylib.WHITE;
        const intersectingLegth = this.height + this.position.y - groundTile.y;
        this.physicsBody.velocity.y -= intersectingLegth;
        break;
      }
    }
    let leftTile = null, rightTile = null;
    for(let row = tiles.rowStart; row <= tiles.rowEnd; row++) {
      let tile = this.game.tileMap.get(tiles.columnStart, row);
      if(tile?.data > 0 && leftTile === null) {
        leftTile = tile;
        leftTile.border.right = raylib.RED;
      }
      tile = this.game.tileMap.get(tiles.columnEnd, row);
      if(tile?.data > 0 && rightTile === null) {
        rightTile = tile;
        rightTile.border.left = raylib.BLUE;
      }
    }

    if(leftTile) {
      const intersectingLegth = leftTile.x + Tile.size - this.position.x;
      this.physicsBody.velocity.x += intersectingLegth;
      // this.position.x = Math.floor(leftTile.x) + Tile.size;
    }
    if(rightTile) {
      const intersectingLegth = this.width + this.position.x - rightTile.x;
      this.physicsBody.velocity.x -= intersectingLegth;
      // this.position.x = Math.floor(rightTile.x) - this.width;
    }

    this.physicsBody.update(delta);
    this.animation.update(delta);
  }

  render() {
    this.animation.render();
    raylib.DrawRectangleLines(this.position.x, this.position.y, this.width, this.height, raylib.ColorAlpha(raylib.RED, 0.5));
    raylib.DrawRectangleLines(this.newPosition.x, this.newPosition.y, this.width, this.height, raylib.ColorAlpha(raylib.BLACK, 0.5));
    return;

    r.DrawRectangleLines(this.player.x,this.player.y,this.player.width,this.player.height,r.WHITE);
    
    if(this.isSmall){
      console.log(this.player.state)
          if(this.player.state=='idle'){
                r.DrawTexturePro(this.player.texture, {
                  x: 8,
                  y: 14,
                  width: 16,
                  height: 18  
              }, {
                  x:this.player.x,
                  y:this.player.y,
                  width:this.player.width ,
                  height:this.player.height
              }, { x: 0,y:0},0,r.WHITE); 
          }
          if(this.player.state=='running'){
               let x=Math.floor(r.GetTime() * 8)%4;
              //  console.log(x);
                r.DrawTexturePro(this.player.texture, {
                  x: 8+(x*32),
                  y: 14,
                  width: 16,
                  height: 18  
              }, {
                  x:this.player.x,
                  y:this.player.y,
                  width:this.player.width ,
                  height:this.player.height
              }, { x: 0,y:0},0,r.WHITE); 
          }

          if(this.player.state=='jump'){
                console.log("jump");
                r.DrawTexturePro(this.player.texture, {
                  x: 8+(5*32),
                  y: 14,
                  width: 16,
                  height: 18  
              }, {
                  x:this.player.x,
                  y:this.player.y,
                  width:this.player.width ,
                  height:this.player.height
              }, { x: 0,y:0},0,r.WHITE);
          }
          
          // if(this.player.state=='backRunning'){
          //   let x=Math.floor(r.GetTime() * 8)%4;
          //     r.DrawTexturePro(this.player.texture, {
          //       x: 8+(x*32),
          //       y: 14,
          //       width: 16,
          //       height: 18  
          //   }, {
          //       x:this.player.x,
          //       y:this.player.y,
          //       width:this.player.width ,
          //       height:this.player.height
          //   }, { x: 0,y:0},0,r.WHITE); 
          // }
 
    
      
    }
    else{
          r.DrawTexturePro(this.player.texture, {
            x: 8+(8*32),
            y: 14,
            width: 16,
            height: 18  
        }, {
            x:this.player.x,
            y:this.player.y,
            width:this.player.width ,
            height:this.player.height
        }, { x: 0,y:0},0,r.WHITE); 
    }
   
 
  }

};