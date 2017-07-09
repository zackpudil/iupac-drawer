export default class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  negate() {
    return new Vector(-this.x, -this.y);
  }

  add(v) {
    return new Vector(this.x+v.x, this.y+v.y);
  }

  subtract(v) {
    return new Vector(this.x-v.x, this.y-v.y);
  }

  rotateUp() {
    return new Vector(this.y, -this.x);
  }

  rotateDown() {
    return new Vector(-this.y, this.x);
  }
}
