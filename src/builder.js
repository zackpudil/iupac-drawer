import 'babel-polyfill';
import CarbonPath from './draw/carbon-path';

function *buildChain(chain) {
  let regex = /c(-|=|~)/g;
  while(true) {
    let a = regex.exec(chain);
    if(!a) return;

    switch(a[1]) {
      case '-':
        yield (c) => c.sigma();
        break;
      case '=':
        yield (c) => c.pi(true);
        break;
      case '~':
        yield(c) => c.sp();
        break;
    }
  }
};

export default (template) => {
  let molecule = new CarbonPath().start({x: 300, y: 300});
  molecule.compose([...buildChain(template.chain)]);

  let recur = (mol, tpt) => {
    let subMol = mol.substituent(tpt.carbon - 1, [...buildChain(tpt.chain)]);
    tpt.subs.forEach(t => recur(subMol, t));
  };

  template.subs.forEach(t => recur(molecule, t));

  return molecule;
};
