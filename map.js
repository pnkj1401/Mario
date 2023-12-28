
const r = require('raylib');
const TM = require('./texturemanager');
const texturemanager = new TM();


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
    // this. maparray=[
            
    //             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

    //             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

    //             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

    //             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

    //             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

    //             [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

    //             [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],

    //             [1,1,1,1,1,1,0,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1],

    //             [1,1,1,1,1,1,0,0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],

    //             [1,1,1,1,1,1,0,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],

    //             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],

    //             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],

    //             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],

    //             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],

    //             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],

    //             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],

    //             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],

    //             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],

    //             [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
              
    //           ]
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
          this.topgrasspath=r.LoadImage("./assets/grass.png");
          this.brickpath=r.LoadImage("./assets/brick.png");
          this.groundstonepath=r.LoadImage("./assets/groundstone.png");
          this.stonepath=r.LoadImage("./assets/stone.png");
          this.questionpath=r.LoadImage("./assets/questionmark.png");
          this.pipepath=r.LoadImage("./assets/pipe.png");
          this.coinpath=r.LoadImage("./assets/coin.png")

          this.topgrass=texturemanager.loadtexture(this.topgrasspath);
          this.brick=texturemanager.loadtexture(this.brickpath);
          this.groundstone=texturemanager.loadtexture(this.groundstonepath);
          this.stone=texturemanager.loadtexture(this.stonepath);
          this.question=texturemanager.loadtexture(this.questionpath);
          this.pipe=texturemanager.loadtexture(this.pipepath);
          this.coin=texturemanager.loadtexture(this.coinpath)

          texturemanager.unloadimage(this.topgrasspath);
          texturemanager.unloadimage(this.brickpath);
          texturemanager.unloadimage(this.groundstonepath);
          texturemanager.unloadimage(this.stonepath);
          texturemanager.unloadimage(this.questionpath);
          texturemanager.unloadimage(this.pipepath);
          texturemanager.unloadimage(this.coinpath);

  }


  drawmap() {
    for (let i = 0; i < this.maparray.length; i++) {
      for (let j = 0; j < this.maparray[i].length; j++) {
        this.tile.x = j * 40;
        this.tile.y = i * 40;

      
        if (this.maparray[i][j] === 0) {
          texturemanager.draw(this.tile.x, this.tile.y, this.tile.height,  this.tile.width, r.SKYBLUE, this.tile.height,  this.tile.width,);

        } else if (this.maparray[i][j] === 1) {   
            texturemanager.DrawTexture(this.groundstone,this.tile.x,this.tile.y,r.WHITE, this.tile.height,  this.tile.width,); 

        } else if(this.maparray[i][j]===2) {
          texturemanager.DrawTexture(this.brick,this.tile.x,this.tile.y,r.WHITE, this.tile.height,  this.tile.width,);
        }

        else if(this.maparray[i][j]===3){
          texturemanager.DrawTexture(this.stone,this.tile.x,this.tile.y,r.WHITE, this.tile.height,  this.tile.width,);
        }
        else if(this.maparray[i][j]===4){
          texturemanager.DrawTexture(this.question,this.tile.x,this.tile.y,r.WHITE, this.tile.height,  this.tile.width,);
        }
        else if(this.maparray[i][j]===5){
          texturemanager.DrawTexture(this.pipe,this.tile.x,this.tile.y,r.WHITE, this.tile.height,  this.tile.width,);
        }
        else if(this.maparray[i][j]===6){
          texturemanager.DrawTexture(this.coin,this.tile.x,this.tile.y,r.WHITE, this.tile.height,  this.tile.width,);
        }

        else{
          texturemanager.draw(this.tile.x, this.tile.y, this.tile.height,  this.tile.width, r.SKYBLUE, this.tile.height,  this.tile.width,);
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
          texturemanager.drawborder(this.collisionmap.x,this.collisionmap.y)
        }
      }
    }
  }
  
  leftCollision(player) {
    const playerX = player.x;
    const playerY = player.y;
    const playerHeight = player.height;
    
    
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
    const playerX = player.x;
    const playerY = player.y;
    const playerWidth = player.width;
    const playerHeight = player.height;
     
    
    let j=Math.floor((playerX+player.width)/this.tile.width);
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
    const playerX = player.x;
    const playerY = player.y;
    const playerWidth = player.width;
    const playerHeight = player.height;
    
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
    const playerX = player.x;
    const playerY = player.y;
    const playerWidth = player.width;

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
      return true;
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

module.exports = Map;

function *getImageColors(image) {
  for(let x = 0; x < image.width; x++) {
    for(let y = 0; y < image.height; y++) {
      const index = (image.width * y + x) * 4;
      yield {
        x, y,
        color: r.GetPixelColor(image.data + index, r.PIXELFORMAT_UNCOMPRESSED_R8G8B8A8)
      };
    }
  }
}


function loadFromImageColors(filepath, colorsMap = {}) {
  const image = r.LoadImage(filepath);
  const colors = getImageColors(image);
  const matrix = [];
  for(const { x, y, color } of colors) {
    if(y in matrix === false) {
      matrix[y] = [];
    }
    const key = `${ color.r }_${ color.g }_${ color.b }_${ color.a }`;
    matrix[y][x] = colorsMap[key];
  }
  return matrix;
}