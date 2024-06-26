import raylib from "raylib";
import Matter from "matter-js";
import Vector2 from "./vector2.js";
import { PhysicsWorld } from "./physics.js";
import Entity from "./entity.js";
import TileMap, { Tile } from "./map.js";
import Animation, { AnimationState } from "./animation.js";
import Canvas from "./canvas.js";
import { using } from "./util.js";
import MarioGame, { Category, PhysicsEntity } from "./mario-game.js";

export default class Player extends Entity {
  #events = {
    moveLeft: false,
    moveRight: false,
    jump: false,
    crouch: false
  };
  jumpForce = 6;
  movementSpeed = 0.15;
  canjump=false;
  inair=true;
  constructor(game, x, y, size) {
    super(game);
    this.game.camera.target.x = x;
    this.width = size;
    this.height = size;
    this.physicsBody = PhysicsWorld.createBody("rectangle", x, y, this.width, this.height, {
      chamfer:{radius:2},
      density: 0.1,
      friction: 0.01,
      frictionStatic: 0.1,
      frictionAir: 0.1,
      restitution: 0,
      collisionFilter: {
        category: Category.PLAYER,
        mask: Category.GROUND | Category.COIN | Category.MUSHROOM
      }
    });
    this.animation = new Animation({
      idleLeft: new AnimationState(Canvas.loadTexture("idle.png", { flipHorizontal: true }), 1),
      idleRight: new AnimationState(Canvas.loadTexture("idle.png"), 1),
      walkLeft: new AnimationState(Canvas.loadTexture("Mario.png", { flipHorizontal: true }), 3),
      walkRight: new AnimationState(Canvas.loadTexture("Mario.png"), 3),
      jumpLeft: new AnimationState(Canvas.loadTexture("jump.png", { flipHorizontal: true }), 1),
      jumpRight: new AnimationState(Canvas.loadTexture("jump.png"), 1),
    }, "idleRight", this.physicsBody.position, this.width, this.height, 6);

    Matter.Events.on(this.game.physicsWorld.engine, 'collisionStart', (event) => {

      event.pairs.forEach((pair) => {
        const { bodyA, bodyB, slop } = pair;
        if(Math.floor(pair.collision.normal.y) > 0){
          this.canjump=true;
        }
        if(Math.ceil(pair.collision.normal.y) < 0) {
          using(this.game.tileMap.getByPosition(bodyB.position), tile => {
            if(tile.data !== 4) {
              return;
            }
            const body = PhysicsWorld.createBody(
              "circle",
              tile.physicsBody.position.x,
              tile.physicsBody.position.y - Tile.size,
              Tile.size / 2,
              {
                density: 4,
                friction: 0.01,
                frictionStatic: 0.01,
                frictionAir: 0.01,
                restitution: 0,
                collisionFilter: {
                  category: Category.MUSHROOM,
                  mask: Category.GROUND | Category.PLAYER
                }
              }
            );
            const entity = new PhysicsEntity(
              this.game,
              Canvas.loadTexture("idle.png"),
              body,
              { width: Tile.size, height: Tile.size }
            );
            this.game.addEntity(entity);
            tile.setData(3);
          });
        }

        const sensorBody = identifySensor(bodyA, bodyB);
        if(sensorBody){
          if(sensorBody.collisionFilter.category == Category.COIN) {
            let col = Math.floor(sensorBody.position.x/Tile.size);
            let row = Math.floor(sensorBody.position.y/Tile.size);
            let cointile = this.game.tileMap.get(col,row);
            using(cointile,(cointile)=>{
              if(cointile.physicsBody === null) {
                return;
              }
              this.game.physicsWorld.removeBody(cointile.physicsBody);
              cointile.setData(0);
              // this.game.physicsWorld.addBody(cointile.physicsBody); // cointile.border.top = raylib.YELLOW;
            })
          }
        }
          
      });
      
    });

    Matter.Events.on(this.game.physicsWorld.engine,'collisionActive',(event)=>{
      this.inair=false;   
    })

    
  }

  createBigBody() {
    this.width = Tile.size * 1.4 - 2;
    this.height = Tile.size * 1.6 - 4;
    const body = PhysicsWorld.createBody("rectangle", this.physicsBody.position.x, this.physicsBody.position.y, this.width, this.height, {
      density: 0.1 / 2.5,
      friction: 0.01,
      frictionStatic: 0.1,
      frictionAir: 0.1,
      restitution: 0,
      collisionFilter: {
        category: Category.PLAYER,
        mask: Category.GROUND | Category.COIN | Category.MUSHROOM
      }
    });
    this.physicsBody = body;
    this.game.physicsWorld.removeBody(this.physicsBody);
    this.game.physicsWorld.addBody(body);
    this.animation.position = body.position;
    this.animation.offsetX = 0;
    this.animation.offsetY = -Tile.size / 3.2;
    this.animation.width = this.width;
    this.animation.height = this.height;
    this.animation.setData({
      idleLeft: new AnimationState(Canvas.loadTexture("Bigidle.png", { flipHorizontal: true }), 1),
      idleRight: new AnimationState(Canvas.loadTexture("Bigidle.png"), 1),
      walkLeft: new AnimationState(Canvas.loadTexture("Bigwalk.png", { flipHorizontal: true }), 3),
      walkRight: new AnimationState(Canvas.loadTexture("Bigwalk.png"), 3),
      jumpLeft: new AnimationState(Canvas.loadTexture("jump.png", { flipHorizontal: true }), 1),
      jumpRight: new AnimationState(Canvas.loadTexture("jump.png"), 1),
    });

  }

  get rect() {
    return {
      x: this.physicsBody.position.x + Tile.size / 2,
      y: this.physicsBody.position.y + Tile.size / 2,
      width: this.physicsBody.bounds.max.x - this.physicsBody.bounds.min.x,
      height: this.physicsBody.bounds.max.y - this.physicsBody.bounds.min.y
    };
  }
  

  handleEvents() {
    this.#events.moveLeft = raylib.IsKeyDown(raylib.KEY_A) || raylib.IsKeyDown(raylib.KEY_LEFT);
    this.#events.moveRight = raylib.IsKeyDown(raylib.KEY_D) || raylib.IsKeyDown(raylib.KEY_RIGHT);
    this.#events.jump = raylib.IsKeyPressed(raylib.KEY_SPACE) || raylib.IsKeyPressed(raylib.KEY_W) || raylib.IsKeyReleased(raylib.KEY_UP);
    this.#events.crouch = raylib.IsKeyDown(raylib.KEY_LEFT_CONTROL) || raylib.IsKeyDown(raylib.KEY_S)  || raylib.IsKeyDown(raylib.KEY_DOWN);
    // console.log(this.#events);
  }

  update(delta) {
    this.handleEvents();
    if(this.#events.moveLeft) {
      Matter.Body.applyForce(this.physicsBody, new Vector2(this.physicsBody.position.x, this.physicsBody.position.y), new Vector2(-this.movementSpeed, 0));
      this.animation.select("walkLeft");
    }
    if(this.#events.moveRight) {
      Matter.Body.applyForce(this.physicsBody, new Vector2(this.physicsBody.position.x, this.physicsBody.position.y), new Vector2(this.movementSpeed, 0));
      this.animation.select("walkRight");
    }
    if(this.#events.jump && this.canjump) {
      Matter.Body.applyForce(this.physicsBody, this.physicsBody.position, new Vector2(0, -this.jumpForce));
      this.canjump=false;
      this.inair=true;
    }
    Matter.Body.setAngularSpeed(this.physicsBody, 0)
 
    if(Math.floor(this.physicsBody.speed)==0){
      this.animation.select(this.animation.currentStateName.includes("Right") ? "idleRight" : "idleLeft");
    }
    if(this.inair){
      this.animation.select(Math.floor(this.physicsBody.velocity.x)<0?"jumpLeft":"jumpRight");
    }

    this.game.camera.target.x = this.physicsBody.position.x ;
    this.game.camera.target.y = this.physicsBody.position.y ;

    this.animation.update(delta/20);
  }

  _update(delta) {

    this.handleEvents();

    if(this.#events.moveLeft) {
      this.physicsBody.applyForce(delta, new Vector2(-this.movementSpeed, 0));
    }
    if(this.#events.moveRight) {
      this.physicsBody.applyForce(delta, new Vector2(this.movementSpeed, 0));
    }
    this.physicsBody.applyGravity(delta);

    let newPosition = this.position.copy().add(Vector2.scaled(this.physicsBody.velocity, delta));
    let tiles = this.game.tileMap.getCollidingTiles(this.position.x, newPosition.y, this.width, this.height);

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


    let topTile = null, bottomTile = null;
    for(let column = tiles.columnStart; column <= tiles.columnEnd; column++) {
      const currentTopTile = this.game.tileMap.get(column, tiles.rowStart);
      const currentBottomTile = this.game.tileMap.get(column, tiles.rowEnd);
      if(currentBottomTile?.data > 0 && bottomTile === null) {
        bottomTile = currentBottomTile;
        this.physicsBody.velocity.y = 0;
        this.position.y = currentBottomTile.physicsBody.position.y - this.height - 0.5;
      }
      if(currentTopTile?.data > 0 && topTile === null) {
        topTile = currentTopTile;
        this.physicsBody.velocity.y = 1;
        // this.position.y = currentTopTile.y - this.height - 0.5;
      }
    }
    if(bottomTile !== null) {
      if(this.#events.jump) {
        this.physicsBody.applyImpulse(new Vector2(0, -this.jumpForce));
      }
      this.physicsBody.applyFriction(delta, this.physicsBody.frictionFactor);
    }

    newPosition = this.position.copy().add(Vector2.scaled(this.physicsBody.velocity, delta));
    tiles = this.game.tileMap.getCollidingTiles(newPosition.x, this.position.y, this.width, this.height);
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
      const intersectingLegth = leftTile.physicsBody.position.x + Tile.size - this.position.x;
      this.physicsBody.velocity.x = 0;
    }
    if(rightTile) {
      const intersectingLegth = this.width + this.position.x - rightTile.physicsBody.position.x;
      this.physicsBody.velocity.x = 0;
    }

    // console.log(this.physicsBody.velocity.x < 0, this.physicsBody.velocity.x > 0);
    const jumpOrWalk = bottomTile === null ? "jump" : "walk";
    if(this.physicsBody.velocity.x < 0) {
      this.animation.select(jumpOrWalk + "Left");
    } else if(this.physicsBody.velocity.x > 0) {
      this.animation.select(jumpOrWalk + "Right");
    } else if(bottomTile !== null) {
      this.animation.select(this.animation.currentStateName.includes("Left") ? "idleLeft" : "idleRight");
    }

    this.oldPosition.set(...this.position);
    this.physicsBody.update(delta);

    this.game.camera.target.x = this.position.x;

    this.animation.update(delta);
  }

  render() {
    // raylib.DrawRectanglePro(this.rect, Vector2.scaled({ x: this.rect.width, y: this.rect.height }, 0.5), this.physicsBody.angle, raylib.RED);
    this.animation.render();
    // raylib.DrawRectangle(this.physicsBody.position.x-this.rect.width/2, this.physicsBody.position.y-this.rect.height/2, this.width,this.height, raylib.RED);

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

function identifySensor(bodyA, bodyB){
  if (bodyA.isSensor) {
    return bodyA;
  }
  if (bodyB.isSensor) {
    return bodyB;
  }
  return null;
}