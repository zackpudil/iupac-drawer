import "babel-polyfill";
import  { prefixOr, suffixOr, subOr, subPreOr, infixOr, composeExp } from './nomenclature';

import translate from './translate';

function *extract(name, regex, tf = (s) => [s]) {
  while(true) {
    let a = regex.exec(name);
    if(a) {
      for(let t of tf(a[1])) yield t;
    } else return;
  }
}

function *complexSubstituents(name)  {
  const regex = /(\d{1,2}(?:,\d{1,2})*-\(\d{1,2}(?:,\d{1,2})*-?(?:\w|-|\d{1,2}(?:,\d{1,2})*)*yl\))/g;
  let parse = (s) => {
    let sub = s
        .replace(/enyl\)/g, 'ene')
        .replace(/yl\)/g, 'ane')
        .replace(/\d(?:,\d)*-\(/g, '');

    let idxs =  /(\d{1,2}(?:,\d{1,2})*)-\(/g.exec(s)[1].split(',');

    return idxs.map(i => ({
      carbon: Number(i),
      chain: sub.replace(composeExp(/\d{1,2}?(?:,\d{1,2})*-?\w*~-?/g, subPreOr()), ''),
      subs: [...substituents(sub)]
    }));
  };
  yield *extract(name, regex, parse);
};

function *substituents(name) {
  const regex = composeExp(/(?:^|-)(\d{1,2}(?:,\d{1,2})*-\w*~(?![^\(\)]*\)|\w*yl))/g, subPreOr());
  let parse = (s) => {
    let [...idxs] = extract(s, /(\d{1,2})/g);
    let suf = s.replace(/\d{1,2}(:?,\d{1,2})*-?/g, '');

    return idxs.map(idx => ({ carbon: Number(idx), chain: suf.replace(/yl/g, 'ane') }));
  };

  yield *extract(name, regex, parse);
};


export default (name) =>  {
  name = translate(name);
  const regex = composeExp(/((?:\w(?!~)|-|\d(?:,\d)*)*(?:ane|yne|ene))/g, subPreOr());

  let ret = {
    chain: regex.exec(name)[1].replace(composeExp(/^(?:-|~)*/g, subPreOr()), ''),
    subs: [...complexSubstituents(name)].concat([...substituents(name)])
  };

  return ret;
};
