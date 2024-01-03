// let playerpath=r.LoadImage("./assets/Mario.png");
// let Bigwalkpath=r.LoadImage("./assets/Bigwalk.png");

import raylib from "raylib";
import Vector2 from "./vector2.js";
import { PhysicsBody } from "./physics.js";
import Entity from "./entity.js";
import { Tile } from "./map.js";


export default class Player extends Entity {
  #events = {
    moveLeft: false,
    moveRight: false,
    jump: false
  };
  constructor(game, x, y, size, texture) {
    super(game, x, y);
    this.width = size;
    this.height = size;
    this.texture = texture;
    this.physicsBody = new PhysicsBody(this.position);
    this.physicsBody.mass = 1;
  }

  handleEvents() {
    this.#events.moveLeft = raylib.IsKeyDown(raylib.KEY_A) || raylib.IsKeyDown(raylib.KEY_LEFT);
    this.#events.moveRight = raylib.IsKeyDown(raylib.KEY_D) || raylib.IsKeyDown(raylib.KEY_RIGHT);
    this.#events.jump = raylib.IsKeyPressed(raylib.KEY_SPACE) || raylib.IsKeyPressed(raylib.KEY_W) || raylib.IsKeyPressed(raylib.KEY_UP);
  }

  update(delta) {

    this.handleEvents();
    this.physicsBody.addGravity(delta);
    if(this.#events.moveLeft) {
      this.physicsBody.applyForce(delta, new Vector2(-1500, 0));
    }
    if(this.#events.moveRight) {
      this.physicsBody.applyForce(delta, new Vector2(1500, 0));
    }
    const newPosition = this.position.copy().add(Vector2.scaled(this.physicsBody.velocity, delta));
    const tiles = this.game.tileMap.getCollidingTiles(newPosition.x, newPosition.y, this.width, this.height);
    let groundTile = null, leftTile = null, rightTile = null;
    for(let column = tiles.columnStart; column <= tiles.columnEnd; column++) {
      const tile = this.game.tileMap.get(column, tiles.rowEnd);
      if(tile.data > 0) {
        groundTile = tile;
        break;
      }
    }
    for(let row = tiles.rowStart; row < tiles.rowEnd; row++) {
      let tile = this.game.tileMap.get(tiles.columnStart, row);
      if(tile.data > 0 && leftTile === null) {
        leftTile = tile;
      }
      tile = this.game.tileMap.get(tiles.columnEnd, row);
      if(tile.data > 0 && rightTile === null) {
        rightTile = tile;
      }
    }
    if(groundTile) {
      groundTile.borderColor = raylib.WHITE;
      this.physicsBody.velocity.y = 0;
      this.position.y = Math.floor(groundTile.y) - this.height - 1;
    }
    if(leftTile) {
      leftTile.borderColor = raylib.RED;
      this.physicsBody.velocity.x = 0;
      this.position.x = Math.floor(leftTile.x) + Tile.size + 1;
    }
    if(rightTile) {
      rightTile.borderColor = raylib.BLUE;
      this.physicsBody.velocity.x = 0;
      this.position.x = Math.floor(rightTile.x) - this.width - 1;
    }
    if(groundTile !== null && this.#events.jump) {
      this.physicsBody.applyForce(delta, new Vector2(0, -60000));
    }
    this.physicsBody.update(delta);
    this.game.camera.target = this.position;
  }

  render() {
    raylib.DrawRectangle(this.position.x, this.position.y, this.width, this.height, raylib.BLACK);
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