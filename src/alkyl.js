import Vector from './vector';

export const LL = 50;
export const DBS = 10;

const rotateBond = (v, rot) => {
  if(rot == 0) return v;
  if(rot == 1) return v.rotateUp();
  if(rot == 2) return v.rotateDown();
};

const sigmaBond = (up, rot) => rotateBond(new Vector(LL, up ? -LL : LL), rot);
const piBond = (rot) => rotateBond(new Vector(LL, 0), rot);

export class Alkyl {
  constructor(startx, starty, rotate) {
    this.startCoord = new Vector(startx, starty);

    this.origin = new Vector(0, 0);
    this.nextOrigin = new Vector(0, 0);
    this.up = true;
    this.rotDir = rotate

    this.bonds = [];
  }

  addAlkane() {
    this.origin = this.nextOrigin;
    this.nextOrigin = this.origin.add(sigmaBond(!this.up, this.rotDir));

    this.up = !this.up;
    this.bonds.push(new Alkane(this.startCoord.add(this.origin), this.startCoord.add(this.nextOrigin), !this.up));

    return this;
  }

  addAlkene(cis) {
    this.origin = this.nextOrigin;
    this.nextOrigin = this.origin.add(piBond(this.rotDir));

    this.bonds.push(new Alkene(this.startCoord.add(this.origin), this.startCoord.add(this.nextOrigin), this.rotDir));
    this.up = cis;

    return this;
  }

  addAlkyne() {
    this.origin = this.nextOrigin;
    this.nextOrigin = this.origin.add(sigmaBond(this.up, this.rotDir));

    this.up = !this.up;

    this.bonds.push(new Alkyne(this.startCoord.add(this.origin), this.startCoord.add(this.nextOrigin), this.rotDir));

    return this;
  }

  draw(path) {
    return this.bonds.reduce((p, c) => p = c.draw(p), path);
  }
}

export class Alkane {
  constructor(coord, nextCoord, up) {
    this.coord = coord;
    this.nextCoord = nextCoord;
    this.up = up;
  }

  draw(path) {
    return path
      .moveto(this.coord)
      .lineto(this.nextCoord);
  }
}

export class Alkene {
  constructor(coord, nextCoord, rotate) {
    this.coord = coord;
    this.nextCoord = nextCoord;
    this.rotDir = rotate;
  }

  draw(path) {
    let dbs = rotateBond(new Vector(0, DBS), this.rotDir);
    return path
      .moveto(this.coord)
      .lineto(this.nextCoord)
      .moveto(this.coord.add(dbs))
      .lineto(this.nextCoord.add(dbs));
  }
}

export class Alkyne {
  constructor(coord, nextCoord, rotate) {
    this.coord = coord;
    this.nextCoord = nextCoord;
    this.rotDir = rotate;
  }

  draw(path) {
    let dbs = rotateBond(this.coord.y > this.nextCoord.y ? new Vector(-DBS, -DBS) : new Vector(-DBS, DBS), this.rotDir);
    return path
      .moveto(this.coord)
      .lineto(this.nextCoord)
      .moveto(this.coord.add(dbs))
      .lineto(this.nextCoord.add(dbs))
      .moveto(this.coord.add(dbs.negate()))
      .lineto(this.nextCoord.add(dbs.negate()));
  }
}
