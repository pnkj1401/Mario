import raylib from "raylib";
import Canvas from "./canvas.js";
import Vector2 from "./vector2.js";
import { PhysicsWorld } from "./physics.js";
import { using } from "./util.js";
import { Category } from "./mario-game.js";

/** @template {number} T */
export class Tile {

  static #size = 32;
  static #textureData = {};
  #position;
  /** @type {raylib.Texture} */
  #texture = null;

  /**
   * @param {number} x
   * @param {number} y
   * @param {T} data
  */
  constructor(x, y, data) {
    this.#position = { x, y };
    this.border = {
      /** @type {raylib.Color | null} */
      left: null,
      /** @type {raylib.Color | null} */
      right: null,
      /** @type {raylib.Color | null} */
      bottom: null,
      /** @type {raylib.Color | null} */
      top: null
    };
    this.setData(data);
  }

  get position() {
    return this.#position;
  }

  /** @param {T} data */
  setData(data) {
    this.data = data;

    switch(data){
      case 0:
        this.physicsBody = null;
      break;
      case 6: {
        this.physicsBody = PhysicsWorld.createBody("rectangle", this.#position.x, this.#position.y, Tile.#size, Tile.#size, {
          isStatic: true,
          restitution: 0,
          friction:1,
          isSensor:true,
          collisionFilter: {
            category: Category.COIN,
            mask: Category.PLAYER
          }
        })
        
       }
      break;
      default:
        {
        this.physicsBody = PhysicsWorld.createBody("rectangle", this.#position.x, this.#position.y, Tile.#size, Tile.#size, {
          isStatic: true,
          restitution: 0,
          friction:1,
          collisionFilter: {
            category: Category.GROUND,
            mask: Category.PLAYER | Category.MUSHROOM
          }
        })
      }
    }

    // this.physicsBody = data !== 0 ? 
    // PhysicsWorld.createBody("rectangle", x, y, Tile.#size, Tile.#size, {
    //   isStatic: true,
    //   restitution: 0,
    //   friction:1,
    // }) : null;
    this.#texture = Tile.#textureData[data] ?? null;
  }

  render() {
    if(this.#texture !== null) {
      const source = {
        x: 0,
        y: 0,
        width: this.#texture.width,
        height: this.#texture.height
      };
      const destination = {
        x: this.physicsBody.position.x,
        y: this.physicsBody.position.y,
        width: Tile.#size,
        height: Tile.#size
      };
      raylib.DrawTexturePro(this.#texture, source, destination, { x: 0, y: 0 }, 0, raylib.WHITE);
    }
    using(this.physicsBody, function() {
      raylib.DrawRectangleLines(this.position.x, this.position.y, this.bounds.max.x - this.bounds.min.x, this.bounds.max.y - this.bounds.min.y, raylib.RED);
    });
    if(this.physicsBody == null) return;
    const borderWidth = 4;
    if(this.border.left) {
      raylib.DrawRectangleLinesEx({
        x: this.physicsBody.position.x,
        y: this.physicsBody.position.y,
        width: borderWidth,
        height: Tile.#size
      }, borderWidth, this.border.left);
      this.border.left = null;
    }
    if(this.border.right) {
      raylib.DrawRectangleLinesEx({
        x: this.physicsBody.position.x + Tile.#size - borderWidth,
        y: this.physicsBody.position.y,
        width: borderWidth,
        height: Tile.#size
      }, borderWidth, this.border.right);
      this.border.right = null
    }
    if(this.border.top) {
      raylib.DrawRectangleLinesEx({
        x: this.physicsBody.position.x,
        y: this.physicsBody.position.y,
        width: Tile.#size,
        height: borderWidth
      }, borderWidth, this.border.top);
      this.border.top = null;
    }
    if(this.border.bottom) {
      raylib.DrawRectangleLinesEx({
        x: this.physicsBody.position.x,
        y: this.physicsBody.position.y + Tile.#size - borderWidth,
        width: Tile.#size,
        height: borderWidth
      }, borderWidth, this.border.bottom);
      this.border.bottom = null;
    }
  }

  static get size() {
    return this.#size;
  }

  static setTextureData(data) {
    this.#textureData = data;
  }

};

export default class TileMap {

  /** @type {Tile[][]} */
  #grid;

  /**
   * @param {number} columns Number of columns
   * @param {number} rows Number of rows
  */
  constructor(columns, rows) {
    this.#grid = new Array(columns);
    for(let column = 0; column < columns; column++) {
      this.#grid[column] = new Array(rows);
      for(let row = 0; row < rows; row++) {
        this.#grid[column][row] = null;
      }
    }
  }

  get columns() {
    return this.#grid.length;
  }

  get rows() {
    return this.#grid[0]?.length ?? 0;
  }

  get(column, row) {
    return this.#grid[column]?.[row] ?? null;
  }

  /** @param {Vector2} position */
  getByPosition(position) {
    return this.#grid[ Math.floor(position.x / Tile.size) ]?.[ Math.floor(position.y / Tile.size) ] ?? null;
  }

  /**
   * @param {Tile<any>} tile
   * @param {{ x?: number; y?: number }} position
   */
  getRelative(tile, position) {
    return this.#grid[ Math.floor(tile.position.x / Tile.size) + (position.x ?? 0) ]?.[ Math.floor(tile.position.y / Tile.size) + (position.y ?? 0) ] ?? null;
  }

  set(column, row, tile) {
    this.#grid[column][row] = tile;
  }



  render() {
    for(const array of this.#grid) {
      for(const tile of array) {
        tile?.render();
      }
    }
    const { rows, columns } = this;
    for(let column = 0; column < columns; column++) {
      raylib.DrawLine(column * Tile.size, 0, column * Tile.size, rows * Tile.size, raylib.WHITE);
    }
    for(let row = 0; row < rows; row++) {
      raylib.DrawLine(0, row * Tile.size, columns * Tile.size, row * Tile.size, raylib.WHITE);
    }
  }

  *[Symbol.iterator] () {
    for(let column = 0; column < this.#grid.length; column++) {
      for(let row = 0; row < this.#grid[column].length; row++) {
        yield /** @type {const} */ ([ column, row, this.#grid[column][row] ]);
      }
    }
  }

  getCollidingTiles(x, y, width, height) {
    const columnStart = x / Tile.size;
    const rowStart = y / Tile.size;
    const columnsOccupiedInWidth = width / Tile.size;
    const rowsOccupiedInHeight = height / Tile.size;
    const columnEnd = Math.min(Math.floor(columnStart + columnsOccupiedInWidth), this.columns - 1);
    const rowEnd = Math.min(Math.floor(rowStart + rowsOccupiedInHeight), this.rows - 1);
    // /** @type {Set<Tile>} */
    // const tiles = new Set();
    // for(const column = columnStart; column <= columnEnd; column++) {
    //   for(const row = rowStart; row <= rowEnd; row++) {
    //     tiles.add(this.#grid[column][row]);
    //   }
    // }
    // return tiles;
    return {
      columnStart: Math.floor(columnStart),
      columnEnd,
      rowStart: Math.floor(rowStart),
      rowEnd
    };
  }

  /**
   * @param {number[][]} matrix
   * @param {(tile: Tile, column: number, row: number) => void} onset
  */
  static load(matrix, onset) {
    console.log(matrix[0]?.length, matrix.length);
    const tiles = new TileMap(matrix[0]?.length, matrix.length);
    for(const [ column, row ] of tiles) {
      const tile = new Tile(
        column * Tile.size,
        row * Tile.size,
        Number.parseInt(matrix[row][column] ?? 1)
      );
      tiles.set(column, row, tile);
      onset?.(tile, column, row);
    }
    // tiles.generateTexture();
    return tiles;
  }


  /**
   * @param {string} data
   * @param {(tile: Tile, column: number, row: number) => void} onset
  */
  static loadFromText(data, onset) {
    const rows = data.split("\n");
    const matrix = rows.filter(row => row.trim() !== "")
      .map(row => row.trim().split(" "));
    return TileMap.load(matrix, onset);
  }

  /**
   * @param {string} name
   * @param {{ [color: string]: number }} colorsMap
   * @param {(tile: Tile, column: number, row: number) => void} onset
   */
  static loadFromImageColors(name, colorsMap, onset) {
    const image = raylib.LoadImage("assets/" + name);
    const colors = Canvas.getImageColors(image);
    const matrix = [];
    for(const { x, y, color } of colors) {
      if(y in matrix === false) {
        matrix[y] = [];
      }
      const key = `${ color.r }_${ color.g }_${ color.b }_${ color.a }`;
      // if(key in colorsMap === false)
      // console.log(key)
      matrix[y][x] = colorsMap[key];
    }
    // const rows = image.split("\n");
    // const matrix = rows.filter(row => row.trim() !== "")
    //   .map(row => row.trim().split(" "));
    return this.load(matrix, onset);
  }

};

class Map {
  constructor() {
    this.tile = {
      x: 0,
      y: 0,
      width:40,
      height:40
    };
    this.collisiontile={
      x: 0,
      y: 0,
      width:40,
      height:40
    }

    this.maparray=loadFromImageColors("./assets/mario1.png",{
      "0_0_0_0": 0,
      "64_64_64_255": 1,
      "127_51_0_255": 2,
      "255_0_220_255": 3,
      "218_255_127_255": 4,
      "76_255_0_255": 5,
      "255_216_0_255":6
    })
    this.collisionmap=loadFromImageColors("./assets/mario1.png",{
      "0_0_0_0": 0,
      "64_64_64_255": 1,
      "127_51_0_255": 2,
      "255_0_220_255": 3,
      "218_255_127_255": 4,
      "76_255_0_255": 5
    })
          this.topgrasspath=raylib.LoadImage("./assets/grass.png");
          this.brickpath=raylib.LoadImage("./assets/brick.png");
          this.groundstonepath=raylib.LoadImage("./assets/groundstone.png");
          this.stonepath=raylib.LoadImage("./assets/stone.png");
          this.questionpath=raylib.LoadImage("./assets/questionmark.png");
          this.pipepath=raylib.LoadImage("./assets/pipe.png");
          this.coinpath=raylib.LoadImage("./assets/coin.png")

          this.topgrass=texturemanageraylib.loadtexture(this.topgrasspath);
          this.brick=texturemanageraylib.loadtexture(this.brickpath);
          this.groundstone=texturemanageraylib.loadtexture(this.groundstonepath);
          this.stone=texturemanageraylib.loadtexture(this.stonepath);
          this.question=texturemanageraylib.loadtexture(this.questionpath);
          this.pipe=texturemanageraylib.loadtexture(this.pipepath);
          this.coin=texturemanageraylib.loadtexture(this.coinpath)

          texturemanageraylib.unloadimage(this.topgrasspath);
          texturemanageraylib.unloadimage(this.brickpath);
          texturemanageraylib.unloadimage(this.groundstonepath);
          texturemanageraylib.unloadimage(this.stonepath);
          texturemanageraylib.unloadimage(this.questionpath);
          texturemanageraylib.unloadimage(this.pipepath);
          texturemanageraylib.unloadimage(this.coinpath);

  }


  drawmap() {
    for (let i = 0; i < this.maparray.length; i++) {
      for (let j = 0; j < this.maparray[i].length; j++) {
        this.tile.x = j * 40;
        this.tile.y = i * 40;

      
        if (this.maparray[i][j] === 0) {
          texturemanageraylib.draw(this.tile.x, this.tile.y, this.tile.height,  this.tile.width, raylib.SKYBLUE, this.tile.height,  this.tile.width,);

        } else if (this.maparray[i][j] === 1) {   
            texturemanageraylib.DrawTexture(this.groundstone,this.tile.x,this.tile.y,raylib.WHITE, this.tile.height,  this.tile.width,); 

        } else if(this.maparray[i][j]===2) {
          texturemanageraylib.DrawTexture(this.brick,this.tile.x,this.tile.y,raylib.WHITE, this.tile.height,  this.tile.width,);
        }

        else if(this.maparray[i][j]===3){
          texturemanageraylib.DrawTexture(this.stone,this.tile.x,this.tile.y,raylib.WHITE, this.tile.height,  this.tile.width,);
        }
        else if(this.maparray[i][j]===4){
          texturemanageraylib.DrawTexture(this.question,this.tile.x,this.tile.y,raylib.WHITE, this.tile.height,  this.tile.width,);
        }
        else if(this.maparray[i][j]===5){
          texturemanageraylib.DrawTexture(this.pipe,this.tile.x,this.tile.y,raylib.WHITE, this.tile.height,  this.tile.width,);
        }
        else if(this.maparray[i][j]===6){
          texturemanageraylib.DrawTexture(this.coin,this.tile.x,this.tile.y,raylib.WHITE, this.tile.height,  this.tile.width,);
        }

        else{
          texturemanageraylib.draw(this.tile.x, this.tile.y, this.tile.height,  this.tile.width, raylib.SKYBLUE, this.tile.height,  this.tile.width,);
        }
      }
    }
  }

  drawcollisionmap(){
    for (let i = 0; i < this.maparray.length; i++) {
      for (let j = 0; j < this.maparray[i].length; j++) {
        this.collisionmap.x = j * 40;
        this.collisionmap.y = i * 40;
        if(this.collisionmap[i][j]===9){
          texturemanageraylib.drawborder(this.collisionmap.x,this.collisionmap.y)
        }
      }
    }
  }
  
  leftCollision(player) {
    const playerX = playeraylib.x;
    const playerY = playeraylib.y;
    const playerHeight = playeraylib.height;
    
    
    let j=Math.floor((playerX)/this.tile.width);
    for(let inc=0;inc<playerHeight;inc+=20){
      let i=Math.floor((playerY+inc)/this.tile.width);
      if(this.maparray[i][j])
      {
          if(this.isCoin(i,j))
          {
            this.maparray[i][j]=0;
            return false;
          }
          this.collisionmap[i][j]=9;
          return {
            y: i*this.tile.width+this.tile.width,
            x:j*this.tile.width+this.tile.width
          };
      }
    }
   
    
    
    let l=Math.floor((playerX)/this.tile.width);
    for(let inc=0;inc<playerHeight;inc+=20){
      let k=Math.floor((playerY+playerHeight-inc)/this.tile.width);
      if(this.maparray[k][l] )
      {
  
          if(this.isCoin(k,l))
          {
            this.maparray[k][l]=0;
            return false;
          }
          this.collisionmap[k][l]=9
          return {
            y: k*this.tile.width+this.tile.width,
            x:l*this.tile.width+this.tile.width
          };
      }
    }

    return false; 
  }
  

  rightCollision(player){
    const playerX = playeraylib.x;
    const playerY = playeraylib.y;
    const playerWidth = playeraylib.width;
    const playerHeight = playeraylib.height;
     
    
    let j=Math.floor((playerX+playeraylib.width)/this.tile.width);
    for(let inc=0;inc<playerHeight;inc+=20){
      let i=Math.floor((playerY+inc)/this.tile.width);
          if(this.maparray[i][j] )
        {
            if(this.isCoin(i,j))
            {
              this.maparray[i][j]=0
              return false;
            }
            this.collisionmap[i][j]=9
            console.log(this.maparray[i][j])
            return {
              y: i*this.tile.width,
              x:j*this.tile.width
            };
        }
    }
    

    
    let l=Math.floor((playerX+playerWidth)/this.tile.width);
    for(let inc=0;inc<playerHeight;inc+=20){
      let k=Math.floor((playerY+(playerHeight)-inc)/this.tile.width);
      if(this.maparray[k][l] )
      {
        if(this.isCoin(k,l ))
        {
          this.maparray[k][l]=0;
          return false;
        }
        this.collisionmap[k][l]=9
        return {
          y: k*this.tile.width,
          x:l*this.tile.width
        };
      }
    }
    
    return false;
  }


  groundCollision(player){
    // console.log(player);
    const playerX = playeraylib.x;
    const playerY = playeraylib.y;
    const playerWidth = playeraylib.width;
    const playerHeight = playeraylib.height;
    
    let i=Math.floor((playerY+playerHeight)/this.tile.width);
    let j=Math.floor((playerX+playerWidth)/this.tile.width);
    if((this.maparray[i][j]))
    {
        if(this.isCoin(i,j))
        {
          this.maparray[i][j]=0;
          return;
        }
        this.collisionmap[i][j]=9;
        return {
          y: i*this.tile.width,
          x:j*this.tile.width
        };
    }
    let k=Math.floor((playerX)/this.tile.width);
    if((this.maparray[i][k]))
    {
         
        if(this.isCoin(i,k))
        {
          this.maparray[i][k]=0;
          return;
        }
        this.collisionmap[i][k]=9;
        return{
          y: i*this.tile.width,
          x:k*this.tile.width
        }
    }
    
  }


  topCollision(player){
    const playerX = playeraylib.x;
    const playerY = playeraylib.y;
    const playerWidth = playeraylib.width;

    let i=Math.floor((playerY)/this.tile.width);
    let j=Math.floor((playerX)/this.tile.width);
    if(this.maparray[i][j])
    {
      if(this.isCoin(i,j))
      {
        this.maparray[i][j]=0;
        return false;
      }
      this.collisionmap[i][j]=9;
      return {
        y: i*this.tile.width,
        x:j*this.tile.width
      };
    }

    let k=Math.floor((playerX+playerWidth)/this.tile.width);
    if(this.maparray[i][k] )
    {
      if(this.isCoin(i,k))
      {
        this.maparray[i][k]=0
        return false;
      }
      this.collisionmap[i][k]=9
      return true;
    }
  }

  isCoin(i,j)
  {
    if(this.maparray[i][j]==6) return true;
    else return false;
  }
}