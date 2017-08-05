import { prefixOr, infixOr, composeExp, FUNCTIONAL_GROUPS } from './nomenclature';

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


export default (name) => {
  return convertFunctionalGroups(name);
};
