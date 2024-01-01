
const r = require('raylib');
const TM = require('./texturemanager');
const texturemanager = new TM();
const Phy = require('./physics');
const Texturemanager = require('./texturemanager');
const { IsKeyUp } = require('raylib');

let physics = new Phy();
let playerpath=r.LoadImage("./assets/Mario.png");
let Bigwalkpath=r.LoadImage("./assets/Bigwalk.png");


class Player {
  canJump = false;
  smallHeight = 38;
  bigHeight = 58;
  constructor() {
    this.player = {
      x: 1,
      y: 5,
      velocity: 0,
      speed:0,
      width : 30,
      height:this.smallHeight,
      texture:texturemanager.loadtexture(playerpath),
      bigwalk:texturemanager.loadtexture(Bigwalkpath),
      state:'idle'
    };

    this.small={
      idle:{ x:6,y:0},
      running:[{},{}],
      jump:[{},{}]
    }
    this.big={
      idle:{ x:6,y:0},
      running:[{},{}],
      jump:[{},{}]
    }
    texturemanager.unloadimage(playerpath);
    texturemanager.unloadimage(Bigwalkpath);
    this.isSmall = true; 
  }

  handleEvents() {

    if(r.IsKeyDown(r.KEY_RIGHT))
    {
        this.player.state='running';      
        physics.addspeed(this.player)                  
    }
    // if(IsKeyUp(r.KEY_RIGHT)) this.player.state='idle';
    if(r.IsKeyDown(r.KEY_LEFT))
    {
        physics.reducespeed(this.player)   
    }
   
    this.canJump = (r.IsKeyDown(r.KEY_UP) || r.IsKeyDown(r.KEY_SPACE) );

    if (r.IsKeyPressed(r.KEY_LEFT_CONTROL)) {
      
      // if(this.player.height===this.smallHeight)  this.player.y-=40
      this.isSmall = !this.isSmall;
      this.player.height = this.isSmall ? this.smallHeight : this.bigHeight;
    }
    
  }

  update(map) {

    let time = r.GetFrameTime();
    physics.applygravity(this.player, time);
    this.player.y += this.player.velocity;
    let nextgroundpos={
      x:this.player.x,
      y:this.player.y+this.player.velocity,
      velocity: this.player.velocity,
      width : this.player.width,
      height:this.player.height
    }
    
    let groundtile=map.groundCollision(nextgroundpos);

    if (groundtile) 
    {
      this.player.state='idle'
      if(this.player.speed>0)
      {
        this.player.state='running';
      }
      else if(this.player.speed<0)
      {
        this.player.state="running";
      }
      this.player.y = groundtile.y-this.player.height-0.5;
      this.player.velocity = 0;
      if(this.canJump)
      {
        physics.applyjumpforce(this.player);    
      } 
    } 
    else {
      this.player.state="jump";
    }
    let nexttoppos={
      x:this.player.x,
      y:this.player.y+this.player.velocity,
      velocity: this.player.velocity,
      width : this.player.width,
      height:this.player.height
    }
    
    let toptile=map.topCollision(nexttoppos)
    if(toptile){
      this.player.velocity=1;
      // this.player.y += this.player.velocity;   
    } 
    
    
    let nextrightpos={
      x:this.player.x+this.player.speed,
      y:this.player.y,
      velocity: this.player.velocity,
      width : this.player.width,
      height:this.player.height
    }
    if(map.rightCollision(nextrightpos))
    {
       this.player.speed=0;
      //  this.player.x-=2;
    }

    if(map.leftCollision(nextrightpos)) {
      this.player.speed=0;
      // this.player.x+=2;
    }
    this.player.x+=this.player.speed;
    
    physics.applyfriction(this.player);
    
    
    
  }

  render() {

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
  
}

module.exports = Player;
