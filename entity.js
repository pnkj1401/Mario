import Vector2 from "./vector2.js";

export default class Entity {
  #game;
  /** @param {import("./mario-game").default} game */
  constructor(game, x, y) {
    this.#game = game;
    this.position = new Vector2(x, y);
  }
  get game() {
    return this.#game;
  }
};