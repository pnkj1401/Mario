export default class Entity {
  #game;
  /** @param {import("./mario-game").default} game */
  constructor(game) {
    this.#game = game;
  }
  get game() {
    return this.#game;
  }

  update() {}

  render() {}

};