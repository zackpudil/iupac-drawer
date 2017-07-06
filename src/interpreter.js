import {Alkyl, Alkane, Alkene, Alkyne} from './alkyl';

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
  { name: 'tetra', amount: 4 },
  { name: 'penta', amount: 5 },
  { name: 'hexa', amount: 6 },
  { name: 'hepta', amount: 7 },
  { name: 'oxa', amount: 8 },
  { name: 'nona', amount: 9 },
  { name: 'deca', amount: 10 }
];

const regexTemplate = (negativeLookBehind, suffix) => {
  let regexOr = (table) => table.reduce( (sum, val, idx) => {
    if(idx == 0)
      sum += val.name;
    else
      sum += "|"+val.name;
    return sum;
  }, "");

  return `(\\d(?:,?\\d?){1,9})-(?!(?:${regexOr(rootToAmount)})a?(?:${regexOr(prefixToAmount)})(:?${negativeLookBehind})).*(?:${regexOr(prefixToAmount)})?${suffix}`;
};


export const alkyneParser = (name) => {
  let re = new RegExp(regexTemplate('en|yl', 'yn'), 'g');
  return re.exec(name)[1].split(',');
};

export const alkeneParser = (name) => {
  let re = new RegExp(regexTemplate('yl', 'en'), 'g');
  return re.exec(name)[1].split(',');
};

export class AlkylInterpreter {
  findInTable(name, table) {
    let find = table.find(cta => {
      if(name.includes(cta.name)) return true;
      return false;
    });

    return find;
  }

  interpret(name) {
    let amount = this.findInTable(name, rootToAmount).amount;

    if(name.endsWith('ane'))
      return this.create(amount, [], []);
    else if(name.endsWith('ene'))
      return this.create(amount, alkeneParser(name), []);
    else if(name.endsWith('yne'))
      return this.create(amount, alkeneParser(name), alkyneParser(name));
  }

  create(amount, enes, ynes) {
    let constituents = [];

    for(let i = 1; i <= amount; i++) {
      if(enes.indexOf('' + i) > -1) {
        constituents.push(new Alkene());
      } else if(ynes.indexOf('' + i) > -1) {
        constituents.push(new Alkyne());
      } else {
        constituents.push(new Alkane());
      }
    }

    return new Alkyl(constituents);
  }
}
