
class physics{

    constructor(){
         this.g=50;
         this.jumpforce=-25;
         this.force=0.7;
         this.terminal=7;
         this.negterminal=-7;
         this.friction=1;
    }
    applygravity(object,deltatime){
        object.velocity+=this.g* deltatime;
    }
    applyjumpforce(object){
       object.velocity+=this.jumpforce;
    }
    addspeed(object){
        if(object.speed>this.terminal){
            object.speed=this.terminal;
        }
        else object.speed=object.speed+this.force
    }
    reducespeed(object){
        if(object.speed<this.negterminal){
            object.speed=this.negterminal;
        }
        else object.speed-=this.force
    }
   
}

module.exports=physics; 