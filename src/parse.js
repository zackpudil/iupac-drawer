import "babel-polyfill";
import  { prefixOr, suffixOr, composeExp } from './nomenclature';

function *extract(name, regex, tf = (s) => [s]) {
  while(true) {
    let a = regex.exec(name);
    if(a) {
      for(let t of tf(a[1])) yield t;
    } else return;
  }
}

function *complexSubstituents(name)  {
  const regex = /(\d(?:,\d)*-\(\d(?:,\d)*-?(?:\w|-|\d(?:,\d)*)*yl\))/g;
  let parse = (s) => {
    let sub = s
        .replace(/enyl\)/g, 'ene')
        .replace(/yl\)/g, 'ane')
        .replace(/\d(?:,\d)*-\(/g, '');

    let idxs =  /(\d(?:,\d)*)-\(/g.exec(s)[1].split(',');

    return idxs.map(i => ({
      carbon: Number(i),
      chain: sub.replace(/\d?(?:,\d)*-?\w*yl-?/g, ''),
      subs: [...substituents(sub)]
    }));
  };
  yield *extract(name, regex, parse);
};

function *substituents(name) {
  const regex = /(?:^|-)(\d(?:,\d)*-\w*yl(?!\)))/g;
  let parse = (s) => {
    let [...idxs] = extract(s, /(\d)/g);
    let suf = s.replace(/\d(:?,\d)*-?/g, '');

    return idxs.map(idx => ({ carbon: Number(idx), chain: suf.replace(/yl/g, 'ane') }));
  };

  yield *extract(name, regex, parse);
};

export default (name) =>  {
  const regex = composeExp(/((?:\w(?!yl)|-|\d(?:,\d)*)*(?:~))/g, suffixOr());

  return {
    chain: regex.exec(name)[1].replace(/yl/g, '').replace(/^-/g, ''),
    subs: [...complexSubstituents(name)].concat([...substituents(name)])
  };
};
