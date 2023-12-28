const r = require('raylib');

class Texturemanager{
    constructor(){  
    
    }
   
   loadtexture(img){
       let tex=r.LoadTextureFromImage(img);
       return tex;
   }

   unloadimage(img){
     r.UnloadImage(img);
   }
   
   DrawTexture(texture,x,y,clr,h,w){
        // r.DrawTexture(texture,x,y,clr);
        r.DrawTexturePro(texture,{
          x:0,
          y:0,
          width:w-24,
          height:h-24
        },{
          x:x,
          y:y,
          width:w,
          height:h
        },{ x: 0,y:0},0,r.WHITE)
   }

   draw(x,y,h,w,c){  
     r.DrawRectangle(x , y, h, w, c); 
   }
   drawborder(x , y){
      r.DrawRectangleLines(x,y,40,40,r.WHITE)
   }
   

}

module.exports=Texturemanager;