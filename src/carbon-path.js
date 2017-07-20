class BondVector {
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

export class CarbonElement {
  d = "";
  carbons = [];
  up = true;
  subs = [];

  prevCarbon = () => [...this.carbons].pop();
  addCarbon = (pv, ene) => this.carbons.push({
    p: pv.a(this.prevCarbon().p),
    up: this.up,
    nextEne: false,
    ene
  });

  start(p) {
    this.d = `M${p.x},${p.y}`;
    this.carbons.push({
      p,
      up: this.up,
      ene: false,
      nextEne: false
    });
    return this;
  }

  sub() {
    let pv = BondVector.cb();
    this.d += `l${pv.d()}`;
    this.carbons = [{
      p: pv.a(this.prevCarbon().p),
      up: this.up,
      ene: false,
      nextEne: false
    }];

    return this;
  }

  compose(subFns) {
    subFns.reduce((a, b) => a = b(a), this);
    return this;
  }

  sigma() {
    let pv = BondVector.cs(this.up);

    this.d += `l${pv.d()}`;
    this.addCarbon(pv, false);
    this.up = !this.up;

    return this;
  }

  pi(cis) {
    let [pv, pmd, pmb] = BondVector.cp(this.up);

    this.d += `l${pv.d()}m${pmd.d()}l${pv.d()}m${pmb.d()}`;
    this.prevCarbon().nextEne = true;
    this.addCarbon(pv, true);
    if(!cis) this.up = !this.up;

    return this;
  }

  sp() {
    let [pv, pmu, pb, pmd, pmb] = BondVector.csp(this.up);

    this.d += `l${pv.d()}m${pmu.d()}l${pb.d()}m${pmd.d()}l${pb.d()}m${pmb.d()}`;
    this.addCarbon(pv, false);
    this.up = !this.up;

    return this;
  }

  substituent(idx, subFns) {
    let carbon = this.carbons[idx];
    let sub = new CarbonElement().start(carbon.p).sub().compose(subFns);

    var a;
    if(carbon.nextEne) a = 120;
    else if(carbon.ene) a = 60;
    else a = 90;

    let up = idx >= 1 ? carbon.p.y > this.carbons[idx-1].p.y : !carbon.p.up;

    this.subs.push({
      d: sub,
      r: { 
        a: a*(up ? 1 : -1),
        x: carbon.p.x,
        y: carbon.p.y
      }
    });

    return sub;
  }

  print() {
    let pt = `<path d="${this.d}" />`;
    pt += this.subs.map(sub => 
      `<g transform="rotate(${sub.r.a}, ${sub.r.x}, ${sub.r.y})">${sub.d.print()}</g>`).join('');

    return pt;
  }
}
