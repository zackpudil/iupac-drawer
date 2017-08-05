import 'babel-polyfill';
import {prefixOr, infixOr, infixCount, composeExp, SUB_TO_ELEMENT_MAP} from './nomenclature';

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
  if(SUB_TO_ELEMENT_MAP[name.replace(prefixOr(), '')])
    return SUB_TO_ELEMENT_MAP[name.replace(prefixOr(), '')];

  let bonds = [...convertBonds(name)];
  if(bonds.length == 0)
    return 'c';

  if(name.match(/cyclo/g)) return 'c'+bonds.join('c')+'c/c';
  return 'c'+bonds.join('c')+'c';
};

const appendEndSubsToChain = (mod) => {
  if(!mod.subs.length || mod.chain.match(/(\/|\?)/g)) {
    mod.subs = mod.subs.map(x => appendEndSubsToChain(x));
    return mod;
  }
  let cc = mod.chain.match(/c/g).length;
  let fs = mod.subs.filter(x => x.carbon == 1 && x.chain != 'o');
  let ls = mod.subs.filter(x => x.carbon == cc && x.chain != 'o');
  if(cc == 1) fs = [];

  let append = (s, a, b) => s.length ? a+s.map(x => x.chain).join('-')+b : '';

  let fbond = fs.length == 1 && fs[0].chain == 'o' ? '=' : '-';
  let lbond = ls.length == 1 && ls[0].chain == 'o' ? '=' : '-';

  mod.chain = `${append(fs, '', fbond)}${mod.chain}${append(ls, lbond, '')}`;
  mod.subs = [...mod.subs
      .filter(x => (x.carbon != 1 && x.carbon != cc) || x.chain == 'o')
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
