
const r = require('raylib');
const TM = require('./texturemanager');
const Map = require('./map');
const Player = require('./player');

const texturemanager = new TM();

class Game {
  constructor(screenWidth, screenHeight, name) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.name = name;
    r.InitWindow(screenWidth, screenHeight, name);
    r.SetTargetFPS(60);
    this.camera = {
      offset: { x: screenWidth / 2, y: screenHeight * 0 },
      target: { x: 0, y: 0 },
      rotation: 0,
      zoom: 1
    };
    this.mymap = new Map();
    this.player = new Player();
   
  }

  getIsClosed() {
    return r.WindowShouldClose();
  }

  handleEvents() {
   this.player.handleEvents();
  }

  update() {
    this.camera.target.x = this.player.player.x;
    // this.camera.target.y = this.player.player.y;
    this.player.update(this.mymap);
  }

  render() {
    this.mymap.drawmap();
    this.player.render();
    this.mymap.drawcollisionmap();
  }
}

module.exports = Game;
