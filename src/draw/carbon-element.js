export default class CarbonElement {

  constructor(carbonPath) {
    this.carbonPath = carbonPath;
  }

  add = (pv, ene) => this.carbonPath.carbons.push({
    p: pv.a(this.carbonPath.prevCarbon().p),
    up: this.carbonPath.up,
    nextEne: false,
    ene: ene 
  });

  start(p) {
    this.carbonPath.carbons.push({
      p,
      up: this.carbonPath.up,
      ene: false,
      nextEne: false
    });
  }

  addSub(pv) {
    this.carbonPath.carbons = [{
      p: pv.a(this.carbonPath.prevCarbon().p),
      up: this.carbonPath.up,
      ene: false,
      nextEne: false
    }];
  }

  addSigma(pv) {
    this.add(pv, false);
  }

  addPi(pv) {
    this.carbonPath.prevCarbon().nextEne = true;
    this.add(pv, true);
  }

  print(idx) {
    var a;
    let carbon = this.carbonPath.carbons[idx];

    if(carbon.nextEne) {
      if(this.carbonPath.carbons[idx - 1].up) a = 120;
      else a = -120;
    } else if(carbon.ene) {
      if(this.carbonPath.carbons[idx + 1].up) a = -60;
      else a = 60;
    } else a = 90;

    let up = idx >= 1 ? carbon.p.y > this.carbonPath.carbons[idx-1].p.y : carbon.up;
    a *= up ? 1 : -1;

    return (s) => `<g transform="rotate(${a}, ${carbon.p.x}, ${carbon.p.y})">${s}</g>`;
  }
}
