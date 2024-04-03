/// <reference path="physics.h.ts"/>

import Matter from "matter-js";
import Vector2 from "./vector2.js";
import raylib from "raylib";

export class PhysicsWorld {

  constructor() {
    this.engine = Matter.Engine.create();
    this.engine.gravity.y = 2;
    // Matter.Render.create({engine: this.engine});
  }

  /** @param {Matter.Body} body */
  addBody(body) {
    Matter.World.addBody(this.engine.world, body);
  }

  /** @param {(Matter.Composite | Matter.Body | Matter.Constraint | Matter.MouseConstraint)[]} bodies */
  add(...bodies) {
    Matter.World.add(this.engine.world, bodies);
  }
   
  /** @param {Matter.Body} body */
  removeBody(body) {
    Matter.World.remove(this.engine.world, body);
  }
  update(delta) {
    Matter.Engine.update(this.engine, delta);
  }

  render() {
    return;
    const bodies = Matter.Composite.allBodies(this.engine.world);
    for(const body of bodies) {
      if(body.render.visible) {
        raylib.DrawRectangle(body.bounds.min.x, body.bounds.min.y, body.bounds.max.x - body.bounds.min.x, body.bounds.max.y - body.bounds.min.y, raylib.RED);
      }
    }
  }

  /**
   * @template {Exclude<keyof typeof Matter.Bodies, "prototype">} T
   * @param {T} type
   * @param {Parameters<typeof Matter.Bodies[T]>} args
  */
  static createBody(type, ...args) {
    return Matter.Bodies[type](...args);
  }

};

/** @type {<T extends keyof typeof Matter, M extends keyof>(type: T) => { new(...args: ): {  } }} */
function createMatterWrapper(type, ) {}

export class Vector {
  constructor() {
    const b = Matter.Vector.create();
  }
};


/** @type {PhysicsBody} */
export const PhysicsBody = class PhysicsBody {

  #body;

  constructor(type, ...args) {
    this.#body = Matter.Bodies[type](...args);
  }

  /**
   * @template {keyof Matter.Body} P
   * @param {P} property
  */
  get(property) {
    return this.#body[property];
  }

  /**
   * @template {} M
   * @param {M} method
   * @param {Parameters<typeof Matter.Body[M]>} args
   * @returns {ReturnType<typeof Matter.Body[M]>}
  */
  invoke(method, ...args) {
    return Matter.Body[method](this.#body, ...args);
  }

};

export class _PhysicsBody {

  gravity = 3000;
  mass = 4;
  area = 0.01;
  dragCoefficient = 0.8;
  frictionFactor = 1000;

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

  applyImpulse(impulse) {
    // Directly modify velocity without considering mass or delta time
    this.velocity.add(impulse);
    // Optionally apply terminal velocity capping
    this.velocity.limit(this.#calculateTerminalVelocity(this.velocity.magnitude()));
  }

  #calculateTerminalVelocity(forceMagnitude) {
    return Math.sqrt(2 * this.mass * forceMagnitude / (this.area * this.dragCoefficient));
  }

  applyGravity(delta) {
    // console.log("gravity applied");
    this.applyForce(delta, new Vector2(0, this.gravity));
  }

  applyFriction(delta, frictionFactor) {
    const frictionDirection = this.velocity.copy().scale(-1).normalize();
    const frictionForce = frictionDirection.scale(frictionFactor * delta);
    const velocityMagnitude = this.velocity.magnitude();
    this.velocity.add(frictionForce).limit(velocityMagnitude);
    if(Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
      this.velocity.x = 0;
      this.velocity.y = 0;
    }
  }

  update(delta) {
    this.#entityPosition.add(Vector2.scaled(this.velocity, delta));
  }

};