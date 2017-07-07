import Path from 'paths-js/path';
import Vector from './vector';

const LL = 80;
const DBS = 10;

const sigmaBond = (up) => new Vector(LL, up ? -LL : LL);
const piBond = () => new Vector(LL, 0);

export class Alkyl {
  constructor(startx, starty) {
    this.startCoord = new Vector(startx, starty);

    this.origin = new Vector(0, 0);
    this.nextOrigin = new Vector(0, 0);
    this.up = true;

    this.bonds = [];
  }

  addAlkane() {
    this.origin = this.nextOrigin;
    this.nextOrigin = this.origin.add(sigmaBond(!this.up));

    this.up = !this.up;
    this.bonds.push(new Alkane(this.startCoord.add(this.origin), this.startCoord.add(this.nextOrigin)));

    return this;
  }

  addAlkene(cis) {
    this.origin = this.nextOrigin;
    this.nextOrigin = this.origin.add(piBond());

    this.bonds.push(new Alkene(this.startCoord.add(this.origin), this.startCoord.add(this.nextOrigin)));
    this.up = cis;

    return this;
  }

  addAlkyne() {
    this.origin = this.nextOrigin;
    this.nextOrigin = this.origin.add(sigmaBond(this.up));

    this.up = !this.up;

    this.bonds.push(new Alkyne(this.startCoord.add(this.origin), this.startCoord.add(this.nextOrigin)));

    return this;
  }

  draw() {
    let path = Path();
    this.bonds.forEach((carbon) => path = carbon.draw(path));

    return path.print();
  }
}

export class Alkane {
  constructor(coord, nextCoord) {
    this.coord = coord;
    this.nextCoord = nextCoord;
  }

  draw(path) {
    return path
      .moveto(this.coord)
      .lineto(this.nextCoord);
  }
}

export class Alkene {
  constructor(coord, nextCoord) {
    this.coord = coord;
    this.nextCoord = nextCoord;
  }

  draw(path) {
    let dbs = new Vector(0, DBS);
    return path
      .moveto(this.coord)
      .lineto(this.nextCoord)
      .moveto(this.coord.add(dbs))
      .lineto(this.nextCoord.add(dbs));
  }
}

export class Alkyne {
  constructor(coord, nextCoord) {
    this.coord = coord;
    this.nextCoord = nextCoord;
  }

  draw(path) {
    let dbs = this.coord.y > this.nextCoord.y ? new Vector(-DBS, -DBS) : new Vector(-DBS, DBS);
    return path
      .moveto(this.coord)
      .lineto(this.nextCoord)
      .moveto(this.coord.add(dbs))
      .lineto(this.nextCoord.add(dbs))
      .moveto(this.coord.add(dbs.negate()))
      .lineto(this.nextCoord.add(dbs.negate()));
  }
}
