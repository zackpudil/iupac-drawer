import Path from 'paths-js/path';

const LL = 80;
const DBS = 20;

export class Alkyl {
  constructor(carbons) {
    this.carbons = carbons;
  }

  draw() {
    let path = Path();
    this.carbons.forEach((carbon, i) => {
      path = carbon.draw(path, i % 2 == 0)
    });

    return path.print();
  }
}

export class Alkane {
  draw(path, down) {
    return path.lineto(LL, down ? -LL : LL);
  }
}

export class Alkene {
  draw(path, down) {
    return path
      .lineto(LL, down ? -LL : LL)
      .moveto(-LL, down ? LL : -LL)
      .moveto(0, down ? -DBS : DBS)
      .lineto(LL - DBS, down ? -(LL - DBS) : LL - DBS)
      .moveto(DBS, 0);
  }
}

export class Alkyne {
  draw(path, down) {
    return path
      .lineto(LL, down ? LL : -LL)
      .moveto(DBS, down ? -DBS : DBS)
      .lineto(-LL, down ? -LL : LL)
      .moveto(-DBS*2, down ? DBS*2 : -DBS*2)
      .lineto(LL, down ? LL : -LL)
      .moveto(DBS, down ? -DBS : DBS);
  }
}
