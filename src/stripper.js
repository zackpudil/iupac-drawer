import 'babel-polyfill';
import {infixOr, infixCount, composeExp} from './nomenclature';
import parse from './parser';

const extract = (regex, name, t = (a) => a.split(',').map(i => Number(i))) => {
  let a = regex.exec(name);
  if(a) return t(a[1]);
  else return [];
};

const stripBonds = (name) => ({
  number: infixCount(extract(composeExp(/(~)/g, infixOr()), name, (a) => a)),
  ynes: extract(/(\d(?:,\d)*)-?\w*yne/g, name),
  enes: extract(/(\d(?:,\d)*)-?\w*en/g, name)
});

function *convertBonds(name) {
  let striped = stripBonds(name);
  for(let i = 1; i < striped.number; i++) {
    if(striped.ynes.includes(i)) yield '~';
    else if(striped.enes.includes(i)) yield '=';
    else yield '-';
  }
};

const stripChain = (name) => {
  let bonds = [...convertBonds(name)];
  if(bonds.length == 0)
    return 'c';

  return 'c'+bonds.join('c')+'c';
};

export default (name) => {
  let recur = (parsed) => Object.assign({}, parsed, {
    chain: stripChain(parsed.chain),
    subs: parsed.subs ? parsed.subs.map(sc => recur(sc)) : []
  });

  return recur(parse(name));
};