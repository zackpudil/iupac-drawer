import {Alkyl, Alkane, Alkene, Alkyne} from './alkyl';
import Structure from './structure';

const rootToAmount = [
  { name: 'meth', amount: 0 },
  { name: 'eth', amount: 1 },
  { name: 'prop', amount: 2 },
  { name: 'but', amount: 3 },
  { name: 'pent', amount: 4 },
  { name: 'hex', amount: 5 },
  { name: 'hept', amount: 6 },
  { name: 'oct', amount: 7 },
  { name: 'non', amount: 8 },
  { name: 'dec', amount: 9 }
];

const prefixToAmount = [
  { name: 'di', amount: 2 },
  { name: 'tri', amount: 3 },
  { name: 'tetr', amount: 4 },
  { name: 'pent', amount: 5 },
  { name: 'hex', amount: 6 },
  { name: 'hept', amount: 7 },
  { name: 'oct', amount: 8 },
  { name: 'non', amount: 9 },
  { name: 'dec', amount: 10 }
];

const tableToOr = (table) => {
  return table.reduce( (sum, val, idx) => {
    if(idx == 0) sum += val.name;
    else sum += "|"+val.name;
    return sum;
  }, "")
};

const regexTemplate = (negativeLookAhead, suffix) => {
  return `(\\d(?:,?\\d?)*)-(?!(?:${tableToOr(prefixToAmount)})?a?(?:${tableToOr(rootToAmount)})a?(?:${tableToOr(prefixToAmount)})?(?:${negativeLookAhead})).*(?:${tableToOr(prefixToAmount)})?a?${suffix}`;
};

export const alkyneParser = (name) => {
  let re = new RegExp(regexTemplate('en|yl', 'yn'), 'g');
  return re.exec(name)[1].split(',');
};

export const alkeneParser = (name) => {
  let re = new RegExp(regexTemplate('yl', 'en'), 'g');
  return re.exec(name)[1].split(',');
};

export const substituentParser = (name) => {
  let reTemp = `-?(\\d(?:,\\d?)*-(?:${tableToOr(prefixToAmount)})?a?(?:${tableToOr(rootToAmount)})yl)`
  let re = new RegExp(reTemp, 'g');

  let ret = [];
  let a = re.exec(name);

  while (a !== null) {
    ret.push(a[1]);
    a = re.exec(name);
  }

  return ret;
};

export default class Interpreter {
  constructor() {
    this.alkylInt = new AlkylInterpreter();
  }

  interpret(name, startCoord) {
    let subData = substituentParser(name);

    let structure = new Structure(subData.reduce((main, sub) => main.replace(sub+"-", ""), name), startCoord);

    subData.forEach(name => {
      let reg = new RegExp(`(\\d(?:,?\\d?)*)-((?:${tableToOr(prefixToAmount)})?a?(?:${tableToOr(rootToAmount)}))yl`, 'g');
      let a = reg.exec(name);

      let suffix = prefixToAmount.reduce((suf, pre) => suf.replace(pre.name, ""), a[2]);

      a[1].split(',').forEach(idx => {
        structure.addSubstituent(suffix + 'ane', idx-1);
      });
    });

    return structure;
  }
}

export class AlkylInterpreter {
  findInTable(name, table) {
    let find = table.find(cta => {
      if(name.includes(cta.name)) return true;
      return false;
    });

    return find;
  }

  interpret(name, startCoord, rotation) {
    let amount = this.findInTable(name, rootToAmount).amount;

    if(name.endsWith('ane'))
      return this.create(amount, [], [], startCoord, rotation);
    else if(name.endsWith('ene'))
      return this.create(amount, alkeneParser(name), [], startCoord, rotation);
    else if(name.endsWith('yne'))
      return this.create(amount, alkeneParser(name), alkyneParser(name), startCoord, rotation);
  }

  create(amount, enes, ynes, startCoord, rotation) {
    let a = new Alkyl(startCoord.x, startCoord.y, rotation);

    let cis = true;
    for(let i = 1; i <= amount; i++) {
      if(enes.indexOf('' + i) > -1) {
        a.addAlkene(cis);
        cis = !cis;
      } else if(ynes.indexOf('' + i) > -1) {
        a.addAlkyne();
      } else {
        a.addAlkane();
      }
    }

    return a;
  }
}
