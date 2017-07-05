import {Alkyl, Alkane, Alkene, Alkyne} from './alkyl';

const carbonToAmount = [
  {name: 'meth', amount: 0 },
  {name: 'eth', amount: 1 },
  {name: 'prop', amount: 2 },
  {name: 'but', amount: 3 },
  {name: 'pent', amount: 4 },
  {name: 'hex', amount: 5 },
  {name: 'hept', amount: 6 },
  {name: 'oct', amount: 7 },
  {name: 'non', amount: 8 },
  {name: 'dec', amount: 9 }
];

export const alkyneParser = (name) => {
  var re = new RegExp(/(\d(?:,?\d?){1,9})-(?!(?:meth|eth|prop|but|pent|hex|hept|oct|non|dec)a?(?:tri|di|tetr|pent)?a?(:?en|yl)).*(?:tr|di|tetr|pent)?yn/g);
  return re.exec(name)[1].split(',');
};

export const alkeneParser = (name) => {
  var re = new RegExp(/(\d(?:,?\d?){1,9})-(?!(?:meth|eth|prop|but|pent|hex|hepta|oct|non|dec)a?(?:tri|di|tetr|pent)?(:?yl)).*(?:tri|di|tetr|pent)?en/g);
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
    let amount = this.findInTable(name, carbonToAmount).amount;

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
