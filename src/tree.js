import * as util from 'util';
const h = { type: 'h' };


const build = (element, idx, carbon, up, primary) => {
  const toNextBond = () => {
    for(let i = 1; i <= 2; i++)  {
      if(idx + i >= element.chain.length) return i;
      if(['-', '=', '/', '?', '~'].indexOf(element.chain[idx + i]) > -1) return i;
    }
  };
  const pb = () => idx ? element.chain[idx - 1] : '';
  const nb = () => idx < element.chain.length ? element.chain[idx + toNextBond()] : '';

  const bond = (el, isSub, prim) => ({
    prev: pb(),
    next: isSub ? '-' : nb(),
    cnext: isSub ? nb() : '',
    idx: isSub ? 0 : idx + toNextBond() + 1,
    carbon: isSub ? 1 : carbon + 1,
    element: el,
    up: isSub ? up : pb() == '=' ? up : !up,
    sub: isSub,
    prim: prim
  });

  if(idx >= element.chain.length) return h;
  let ret = { type: element.chain.substr(idx, toNextBond()) };

  
  let bonds = element.subs
    .filter(s => s.carbon == carbon)
    .map(s => bond(s, true, false));
  bonds.push(bond(element, false, primary));

  ret.bonds = bonds.map(b => {
    let na = up ? 'd' : 'u';
    let sa = up ? 'u' : 'd';
    if(b.sub) [na,sa] = [sa, na];

    let cc = b.element.chain.match(/(c|f|cl|br|i|oH)/g).length - 1;
    let cn = b.carbon - 1;
    let uc = !b.prim ? 'u' : '';

    let ret = {};
    if(b.next == '-')  {
      if(b.prev == '=') ret.angle = `${sa}-spi`;
      else if(b.prev == '~') ret.angle = `stri`;
      else if(b.cnext == '=') ret.angle = `${sa}-tpi`;
      else if(b.prev == '/' || b.prev == '?') ret.angle = 'u-sig';
      else if(b.cnext == '/' || b.cnext == '?') ret.angle = 'u-fsig';
      else ret.angle = `${na}-sig`;
    } 
    else if(b.next == '=') ret.angle = `${na}-pi`;
    else if(b.next == '/') ret.angle = `${cc}${cn}-${uc}csig`;
    else if(b.next == '?') ret.angle = `${cc}${cn}-${uc}cpi`;
    else if(b.next == '~') ret.angle = `tri`;

    ret.to = build(b.element, b.idx, b.carbon, b.up, b.carbon > 1);
    return ret;
  });

  return ret;
}

export default (model) => build(model, 0, 1, false, true);
