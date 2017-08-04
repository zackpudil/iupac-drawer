import 'babel-polyfill';
import {infixOr, infixCount, composeExp} from './nomenclature';

const extract = (regex, name, t = (a) => a.split(',').map(i => Number(i))) => {
  let a = regex.exec(name);
  if(a) return t(a[1]);
  else return [];
};

const stripBonds = (name) => ({
  number: infixCount(extract(composeExp(/(~)/g, infixOr()), name, (a) => a)),
  cyclo: name.match(/cyclo/g) != null,
  ynes: extract(/(\d(?:,\d)*)-?\w*yne/g, name),
  enes: extract(/(\d(?:,\d)*)-?\w*en/g, name)
});

function *convertBonds(name) {
  let striped = stripBonds(name);

  for(let i = 1; i < striped.number; i++) {
    if(striped.ynes.includes(i)) yield '~';
    else if(striped.enes.includes(i)) yield striped.cyclo ? '?' : '=';
    else yield striped.cyclo ? '/' : '-';
  }
};

const stripChain = (name) => {
  if(name.includes('fluoro')) return 'f';
  if(name.includes('chloro')) return 'cl';
  if(name.includes('bromo')) return 'br';
  if(name.includes('iodo')) return 'i';
  if(name.includes('hydroxy')) return 'oH';

  let bonds = [...convertBonds(name)];
  if(bonds.length == 0)
    return 'c';

  if(name.match(/cyclo/g)) return 'c'+bonds.join('c')+'c/c';
  return 'c'+bonds.join('c')+'c';
};

const appendEndSubsToChain = (mod) => {
  if(!mod.subs.length || mod.chain.match(/(\/|\?)/g)) return mod;
  let cc = mod.chain.match(/c/g).length;
  let fs = mod.subs.filter(x => x.carbon == 1);
  let ls = mod.subs.filter(x => x.carbon == cc);

  let append = (s, a, b) => s.length ? a+s.map(x => x.chain).join('-')+b : '';

  mod.chain = `${append(fs, '', '-')}${mod.chain}${append(ls, '-', '')}`;
  mod.subs = [...mod.subs
      .filter(x => x.carbon != 1 && x.carbon != cc)
      .map(m => {
        m.carbon += fs.length ? 1 : 0;
        return m;
      })];
  return mod;
};

export default (molecule) => {
  let recur = (mol) => Object.assign({}, mol, {
    chain: stripChain(mol.chain),
    subs: mol.subs ? mol.subs.map(sc => recur(sc)) : []
  });

  return appendEndSubsToChain(recur(molecule));
};
