export default class Entity {
  #game;
  /** @param {import("./mario-game").default} game */
  constructor(game, x, y) {
    this.#game = game;
  }
  get game() {
    return this.#game;
  }
};