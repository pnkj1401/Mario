import raylib from "raylib";
import Vector2 from "./vector2.js";

export default class Canvas {

  /**
   * @param {number} width
   * @param {number} height
   * @param {{ title?: string; fps?: number; backgroundColor?: raylib.Color }} options
  */
  constructor(width, height, options = {}) {

    this.width = width;
    this.height = height;
    this.backgroundColor = options?.backgroundColor ?? raylib.WHITE;

    raylib.InitWindow(this.width, this.height, options?.title ?? "Game Window");
    let desiredFPS = options?.fps ?? 60;
    raylib.SetTargetFPS(desiredFPS);

  }

  get center() {
    return new Vector2(Number.parseInt(this.width / 2), Number.parseInt(this.height / 2));
  }

  /**
   * @param {string} imagePath
   * @param {{ flipVertical?: boolean; flipHorizontal?: boolean }} options
  */
  static loadTexture(imagePath, options = {}) {
    const image = raylib.LoadImage("assets/" + imagePath);
    if(options?.flipVertical) {
      raylib.ImageFlipVertical(image);
    }
    if(options?.flipHorizontal) {
      raylib.ImageFlipHorizontal(image);
    }
    const texture = raylib.LoadTextureFromImage(image);
    raylib.UnloadImage(image);
    console.log("assets/" + imagePath + " loaded");
    return texture;
  }

  static *getImageColors(image) {
    for(let x = 0; x < image.width; x++) {
      for(let y = 0; y < image.height; y++) {
        const index = (image.width * y + x) * 4;
        yield {
          x, y,
          color: raylib.GetPixelColor(image.data + index, raylib.PIXELFORMAT_UNCOMPRESSED_R8G8B8A8)
        };
      }
    }
  }

};