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
    const acceleration = Vector2.scaled(force, 1 / this.mass);
    this.velocity.add(acceleration.scale(delta));
    const terminalVelocity = this.#calculateTerminalVelocity(force.magnitude());
    this.velocity.limit(terminalVelocity);
  }

  #calculateTerminalVelocity(forceMagnitude) {
    return Math.sqrt(2 * this.mass * forceMagnitude / (this.area * this.dragCoefficient));
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
    const frictionFactor = 1000 * delta;
    const frictionDirection = this.velocity.copy().scale(-1).normalize();
    const frictionForce = frictionDirection.scale(frictionFactor);
    const velocityMagnitude = this.velocity.magnitude();
    this.velocity.add(frictionForce).limit(velocityMagnitude);
    if(Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
      this.velocity.x = 0;
      this.velocity.y = 0;
    }
    this.#entityPosition.add(Vector2.scaled(this.velocity, delta));
  }

};