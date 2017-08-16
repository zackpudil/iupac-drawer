import { prefixOr, subPreOr, infixOr, infixCount, composeExp, FUNCTIONAL_GROUPS, INFIX } from './nomenclature';

const functionalGroups = (name) => FUNCTIONAL_GROUPS
  .filter(fg => name.endsWith(fg.main))
  .map(fg => {
    let match = composeExp(/(\d{1,2}(?:,\d{1,2})*)?-?(?!\w*~)\w*~1/g, subPreOr(), fg.main).exec(name);

    let newParent = name
      .replace(composeExp(/-?(?:\d{1,2}(?:,\d{1,2})*)?-?~?~1/g, prefixOr(), fg.main), 'e')
      .replace(composeExp(/(?:\d{1,2}(?:,\d{1,2})*)-((?:cyclo)?~(?!\w*en|\w*yn|\w*yl).)/g, infixOr()), '$1')
      .replace(/ae$/g, 'ane');

    var sub;
    let idx = match[1] || '1';

    if(fg.main == 'oate') idx = /(\d)-oxxa(?![^\(\)]*\))/g.exec(name)[1] - 1;

    if(name.match(/cyclo(?!\w*yl)/g)) 
      sub = fg.cyclosub.replace('$', idx);
    else
      sub = fg.sub.replace('$', idx);

    let newName = `${idx}-${sub}-${newParent}`;

    return newName;
  })[0];

const ethers = (name) => {
  let oxy = /(.*(?:\d{1,2}(?:,\d{1,2})*)?-?\w*)(?:yl|oxy)\s/g.getMatch(name);
  if(!oxy) return name;

  let main = name.replace(/.*\s/g, '');

  let oc = infixCount(oxy);
  let mc = infixCount(main);

  let os = composeExp(/.*~\)?/g, subPreOr())
    .getMatch(oxy)
    .replace(/(\d{1,2})(?![^\(\)]*\))/g, (n) => Number(n) + mc + 1);

  let ms = composeExp(/.*~\)?/g, subPreOr()).getMatch(main);

  let suf = composeExp(/.*~(\w*)$/g, infixOr()).getMatch(main);
  let sn = /-?(\d(?:,\d)*)(?=.*en)(?!.*(?:yl|mo))/g.getMatch(main);

  const getDash = (s) => s ? '-' : '';

  let od = getDash(os);
  let md = getDash(ms);
  let sd = getDash(sn);
  
  return `${os}${od}${ms}${md}${mc + 1}-oxxa-${sn}${sd}${INFIX[oc + mc]}${suf}`;
};

const amines = (name) => {
  if(!name.includes('N')) return name;

  name = name.replace('amine', 'e');
  let cc = infixCount(name) + 1;
  let nx = name.match(/N/g).length == 1 ? 'haza' : 'aza';

  name = name
    .replace(/N/g, cc)
    .replace(composeExp(/~(ane|ene|yne)/g, INFIX[cc - 2]), INFIX[cc - 1] + '$1');

  return `${cc}-${nx}-${name}`;
};

const fixes = (name) => {
  return name
    .replace(/(\d(?:,\d)*)-formyl/g, '$1-hydoro-$1-oxo')
    .replace(/oxa/g, 'oxxa')
    .replace(/ylamine/g, 'anamine');
}

export default (name) => {
  let nn = amines(ethers(fixes(name)));
  return functionalGroups(nn) || nn;
}
