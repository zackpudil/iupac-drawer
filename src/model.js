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

  if(name.match(/cyclo/g))   {
    let lastBond = name.match(composeExp(/(~)-?\w*en/g, infixCount(infixOr().getMatch(name)))) ? '?' : '/';
    return 'c'+bonds.join('c')+'c' + lastBond + 'c';
  }

  return 'c'+bonds.join('c')+'c';
};

const appendEndSubsToChain = (mod) => {
  if(!mod.subs.length || mod.chain.match(/(\/|\?)/g)) {
    mod.subs = mod.subs.map(x => appendEndSubsToChain(x));
    return mod;
  }

  let cc = mod.chain.match(/(c|nHx)/g).length;
  let fs = mod.subs.filter(x => x.carbon == 1 && !x.chain.match(/(\/|\?)/g) && x.chain != 'o');
  let ls = mod.subs.filter(x => x.carbon == cc && !x.chain.match(/(\/|\?)/g) && x.chain != 'o');
  if(cc == 1) fs = [];

  let append = (s, a, b) => s.length ? a+s.map(x => x.chain).join('-')+b : '';

  let fbond = fs.length == 1 && fs[0].chain == 'o' ? '=' : '-';
  let lbond = ls.length == 1 && ls[0].chain == 'o' ? '=' : '-';

  let childSubs = mod.subs
    .filter(s => s.carbon == 1 || s.carbon == cc)
    .reduce((a, b) => a.concat(b.subs), [])
    .map(s => { s.carbon += cc; return s; });

  mod.chain = `${append(fs, '', fbond)}${mod.chain}${append(ls, lbond, '')}`;
  mod.subs = [...mod.subs
      .filter(x => (x.carbon != 1 && x.carbon != cc) || x.chain.match(/(\/|\?)/g) || x.chain == 'o')
      .map(m => {
        m.carbon += fs.length ? 1 : 0;
        return m;
      }), ...childSubs];
  return mod;
};

const replacementSubs = (mod) => {
  if(!mod.subs.length) return mod;
  if(!mod.subs.some(m => m.chain.includes('x'))) return mod;

  mod.subs
    .filter(m => m.chain.includes('x'))
    .forEach(rep => {
      let idx = mod.chain.split(/(c|ox|nx|nHx)/g, rep.carbon).join('c').length;
      while(mod.chain[idx] != 'c') {
        idx += 1;
        if(mod.chain.length < idx) break;
      }

      mod.chain = mod.chain.substr(0, idx) + rep.chain + mod.chain.substr(idx + 1);

      if(rep.carbon == 1 && (mod.chain.includes('/') || mod.chain.includes('?')))
        mod.chain = mod.chain.replace(/c$/g, 'x');
    });

  mod.subs = mod.subs.map(m => replacementSubs(m));
  mod.subs = mod.subs.filter(m => ['ox', 'nx', 'nHx'].indexOf(m.chain) == -1);

  return mod;
};

export default (molecule) => {
  let recur = (mol) => Object.assign({}, mol, {
    chain: stripChain(mol.chain),
    subs: mol.subs ? mol.subs.map(sc => recur(sc)) : []
  });

  return appendEndSubsToChain(replacementSubs(recur(molecule)));
};
