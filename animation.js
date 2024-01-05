import raylib from "raylib";
import Vector2 from "./vector2.js";

/** @template {{ [state: string]: AnimationState }} S */
export default class Animation {

  counter = 0;
  time = 0;

  /**
   * @param {S} data
   * @param {keyof S} initialState
   * @param {Vector2} position
   * @param {number} width
   * @param {number} height
   * @param {number} speed
  */
  constructor(data, initialState, position, width, height, speed) {
    this.data = data;
    this.currentStateName = initialState;
    this.position = position;
    this.width = width;
    this.height = height;
    this.speed = speed ?? 6;
  }

  /** @param {keyof S} name */
  select(name) {
    if(name in this.data && this.currentStateName !== name) {
      this.time = 0;
      this.currentStateName = name;
    }
  }

  update(delta) {
    this.time += delta * this.speed;
  }

  render() {
    const currentState = this.data[this.currentStateName];
    const position = Math.floor(this.time) % currentState.framesCount;
    const isVertical = currentState.orientation === "vertical";
    const size = Math.floor((isVertical ? currentState.texture.height : currentState.texture.width) / currentState.framesCount);
    const source = isVertical ? {
      x: 0,
      y: size * position,
      width: currentState.texture.width,
      height: size
    } : {
      x: size * position,
      y: 0,
      width: size,
      height: currentState.texture.height
    };

    const destination = {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height
    };
    raylib.DrawTexturePro(currentState.texture, source, destination, { x: 0, y: 0 }, 0, raylib.WHITE);
    // raylib.DrawRectangleLinesEx(destination, 1, raylib.RED);
  }

};

export class AnimationState {
  /**
   * @param {import("raylib").Texture} texture
   * @param {number} frames No. of frames
   * @param {"vertical" | "horizontal"} orientation
  */
  constructor(texture, frames, orientation = "horizontal") {
    this.texture = texture;
    this.framesCount = frames;
    this.orientation = orientation;
  }
};