export default class Vector2 {
  x = 0;
  y = 0;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  static zero() {
    return new Vector2(0, 0);
  }

  copy() {
    return new Vector2(this.x, this.y);
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  subtract(other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  scale(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const magnitude = this.magnitude();
    if (magnitude !== 0) {
      this.x /= magnitude;
      this.y /= magnitude;
    }
    return this;
  }

  limit(max) {
    if (this.magnitude() > max) {
      this.normalize().scale(max);
    }
    return this;
  }

  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
  }

  static scaled(vector, scalar) {
    return new Vector2(vector.x * scalar, vector.y * scalar);
  }

  static distance(v1, v2) {
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }
};