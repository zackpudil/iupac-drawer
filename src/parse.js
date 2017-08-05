import "babel-polyfill";
import  { prefixOr, suffixOr, subOr, infixOr, composeExp, FUNCTIONAL_GROUPS } from './nomenclature';

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
      chain: sub.replace(/\d{1,2}?(?:,\d{1,2})*-?\w*(?:yl|mo|oro|xo|do|xy)-?/g, ''),
      subs: [...substituents(sub)]
    }));
  };
  yield *extract(name, regex, parse);
};

function *substituents(name) {
  const regex = /(?:^|-)(\d{1,2}(?:,\d{1,2})*-\w*(?:yl|mo|oro|xo|do|xy)(?!\)|\w*yl))/g;
  let parse = (s) => {
    let [...idxs] = extract(s, /(\d{1,2})/g);
    let suf = s.replace(/\d{1,2}(:?,\d{1,2})*-?/g, '');

    return idxs.map(idx => ({ carbon: Number(idx), chain: suf.replace(/yl/g, 'ane') }));
  };

  yield *extract(name, regex, parse);
};

const convertFunctionalGroups = (name) => FUNCTIONAL_GROUPS
  .filter(fg => name.includes(fg.main))
  .map(fg => {
    let match = composeExp(/(\d{1,2}(?:,\d{1,2})*)?-?(?!\w*yl|mo|oro|xo|do|xy)\w*~/g, fg.main).exec(name);

    let newParent = name
      .replace(composeExp(/-?(?:\d{1,2}(?:,\d{1,2})*)?-?~?~1/g, prefixOr(), fg.main), 'e')
      .replace(composeExp(/(?:\d{1,2}(?:,\d{1,2})*)-((?:cyclo)?~(?!\w*en|\w*yn|\w*yl).)/g, infixOr()), '$1')
      .replace(/ae$/g, 'ane');

    var sub;
    let idx = match[1] ? match[1] : '1';

    if(name.match(/cyclo(?!\w*yl)/g)) 
      sub = fg.cyclosub.replace('$', idx);
    else
      sub = fg.sub.replace('$', idx);

    let newName = `${idx}-${sub}-${newParent}`;

    return newName;
  })[0];

export default (name) =>  {
  name = convertFunctionalGroups(name) || name;
  const regex = /((?:\w(?!yl|mo|oro|xo|do|xy)|-|\d(?:,\d)*)*(?:ane|yne|ene))/g;

  let ret = {
    chain: regex.exec(name)[1].replace(/^(?:-|yl|mo|oro|xo|do|xy)*/g, ''),
    subs: [...complexSubstituents(name)].concat([...substituents(name)])
  };

  return ret;
};
