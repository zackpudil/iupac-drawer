import { BondVector } from './bond-vector';
import CarbonElement from './carbon-element';

export default class CarbonPath {
  d = "";
  carbons = [];
  up = true;
  subs = [];

  prevCarbon = () => [...this.carbons].pop();

  constructor() {
    this.element = new CarbonElement(this);
  }
  
  start(p) {
    this.d = `M${p.x},${p.y}`;
    this.element.start(p);
    return this;
  }

  startSub() {
    let pv = BondVector.cb();
    this.d += `l${pv.d()}`;
    this.element.addSub(pv);
    return this;
  }

  compose(subFns) {
    subFns.reduce((a, b) => a = b(a), this);
    return this;
  }

  sigma() {
    let pv = BondVector.cs(this.up);

    this.d += `l${pv.d()}`;
    this.element.addSigma(pv);
    this.up = !this.up;

    return this;
  }

  pi(cis) {
    let [pv, pmd, pmb] = BondVector.cp(this.up);

    this.d += `l${pv.d()}m${pmd.d()}l${pv.d()}m${pmb.d()}`;
    this.element.addPi(pv);
    if(!cis) this.up = !this.up;

    return this;
  }

  sp() {
    let [pv, pmu, pb, pmd, pmb] = BondVector.csp(this.up);

    this.d += `l${pv.d()}m${pmu.d()}l${pb.d()}m${pmd.d()}l${pb.d()}m${pmb.d()}`;
    this.element.addSigma(pv);
    this.up = !this.up;

    return this;
  }

  substituent(idx, subFns) {
    let carbon = this.carbons[idx];
    let sub = new CarbonPath().start(carbon.p).startSub().compose(subFns);
    carbon.sub = sub;
    return sub;
  }

  print() {
    let pt = `<path d="${this.d}" />`;
    pt += this.carbons.map((carbon, idx) => {
      if(!carbon.sub) return '';
      return this.element.print(idx)(carbon.sub.print());
    }).join('');

    return pt;
  }
}
