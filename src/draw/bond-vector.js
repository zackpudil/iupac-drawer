export class BondVector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static cs = (up)  => new BondVector(30, up ? -30 : 30);
  static cp = (up) => [
    new BondVector(30, 0), 
    new BondVector(-30, up ? -5 : 5), 
    new BondVector(0, up ? 5 : -5)
  ];

  static csp = (up) => [
    new BondVector(30, up ? 30 : -30), 
    new BondVector(-30, up ? -25 :  25), 
    new BondVector(30, up ? 30 : -30),
    new BondVector(-25, up ? -35 : 35),
    new BondVector(-5, 0)
  ];

  static cb = () => new BondVector(30, 0);

  d = () => `${this.x},${this.y}`;
  a = (v) => ({ x: v.x + this.x, y: v.y + this.y });
}
