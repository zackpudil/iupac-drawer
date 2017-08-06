import { prefixOr, infixOr, infixCount, composeExp, FUNCTIONAL_GROUPS, INFIX } from './nomenclature';

const convertFunctionalGroups = (name) => FUNCTIONAL_GROUPS
  .filter(fg => name.includes(fg.main))
  .map(fg => {
    let match = composeExp(/(\d{1,2}(?:,\d{1,2})*)?-?(?!\w*yl|mo|oro|xo|do|xy)\w*~/g, fg.main).exec(name);

    let newParent = name
      .replace(composeExp(/-?(?:\d{1,2}(?:,\d{1,2})*)?-?~?~1/g, prefixOr(), fg.main), 'e')
      .replace(composeExp(/(?:\d{1,2}(?:,\d{1,2})*)-((?:cyclo)?~(?!\w*en|\w*yn|\w*yl).)/g, infixOr()), '$1')
      .replace(/ae$/g, 'ane');

    var sub;
    let idx = match[1] || '1';

    if(name.match(/cyclo(?!\w*yl)/g)) 
      sub = fg.cyclosub.replace('$', idx);
    else
      sub = fg.sub.replace('$', idx);

    let newName = `${idx}-${sub}-${newParent}`;

    return newName;
  })[0];

const convertEthers = (name) => {
  let oxy = /(.*(?:\d{1,2}(?:,\d{1,2})*)?-?\w*)oxy\s/g.getMatch(name);
  if(!oxy) return name;

  let main = name.replace(composeExp(/~oxy\s/g, oxy), '');

  let oc = infixCount(oxy);
  let mc = infixCount(main);

  let os = /.*(?:yl|mo|oro|xo|do|xy)/g.getMatch(oxy);
  os = os.replace(/(\d{1,2})/g, (n) => Number(n) + mc + 1);

  let ms = /.*(?:yl|mo|oro|xo|do|xy)/g.getMatch(main);

  let suf = composeExp(/.*~(\w*)$/g, infixOr()).getMatch(main);
  let sn = /-?(\d(?:,\d)*)(?=.*en)(?!.*(?:yl|mo))/g.getMatch(main);

  const getDash = (s) => s ? '-' : '';

  let od = getDash(os);
  let md = getDash(ms);
  let sd = getDash(sn);
  
  return `${os}${od}${ms}${md}${mc + 1}-oxa-${sn}${sd}${INFIX[oc + mc]}${suf}`;
};


export default (name) => {
  let nn = convertEthers(name);
  return convertFunctionalGroups(nn) || nn;
}
