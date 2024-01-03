import Vector2 from "./vector2.js";

export class PhysicsBody {

  gravity = 60;
  mass = 4;
  area = 0.01;
  dragCoefficient = 0.2;

  velocity = new Vector2();
  acceleration = new Vector2();
  #entityPosition;

  /** @param {Vector2} entityPosition */
  constructor(entityPosition) {
    this.#entityPosition = entityPosition;
  }

  /** @param {Vector2} force */
  applyForce(delta, force) {
    const acceleration = new Vector2(force.x / this.mass, force.y / this.mass);
    this.velocity.add(acceleration.scale(delta));
    const magnitude = Math.sqrt(force.x * force.x + force.y * force.y) / 10;
    const terminalVelocity = Math.sqrt(
      (2 * this.mass * magnitude) / (this.area * this.dragCoefficient)
    );
    const absoluteVelocity = Math.abs(this.velocity.x);
    if(absoluteVelocity > terminalVelocity) {
      this.velocity.x = Math.sign(this.velocity.x) * terminalVelocity;
    }
  }

  addGravity() {
    const acceleration = new Vector2(0, this.gravity * this.mass);
    this.velocity.add(acceleration);
    const terminalVelocity = Math.sqrt(
      (2 * this.mass * this.gravity) / (this.area * 0.1)
    );
    if(this.velocity.y > terminalVelocity) {
      this.velocity.y = terminalVelocity;
    }
  }

  update(delta) {
    const frictionDirection = -Math.sign(this.velocity.x);
    if(frictionDirection !== 0) {
      let frictionFactor = 20;
      const absoluteVelocity = Math.abs(this.velocity.x);
      if(absoluteVelocity < frictionFactor) {
        frictionFactor = absoluteVelocity;
      }
      const frictionForce = new Vector2(frictionDirection * frictionFactor, 0);
      this.velocity.add(frictionForce);
    }
    this.#entityPosition.add(Vector2.scaled(this.velocity, delta));
  }

};