const h = { type: 'h' };

const build = (element, idx, carbon, up) => {
  if(idx >= element.chain.length) return h;
  let ret = { type: element.chain[idx] };

  const pb = () => idx ? element.chain[idx - 1] : '';
  const nb = () => idx < element.chain.length ? element.chain[idx + 1] : '';

  const bond = (el, isSub) => ({
    prev: pb(),
    next: isSub ? '-' : nb(),
    cnext: isSub ? nb() : '',
    idx: isSub ? 0 : idx + 2,
    carbon: isSub ? 1 : carbon + 1,
    element: el,
    up: isSub ? up : pb() == '=' ? up : !up,
    sub: isSub
  });

  let bonds = element.subs
    .filter(s => s.carbon == carbon)
    .map(s => bond(s, true));
  bonds.push(bond(element, false));

  ret.bonds = bonds.map(b => {
    let na = up ? 'd' : 'u';
    let sa = up ? 'u' : 'd';
    if(b.sub) [na,sa] = [sa, na]

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
    else if(b.next == '/') ret.angle = `${b.element.chain.match(/c/g).length - 1}${b.carbon - 1}-csig`;
    else if(b.next == '?') ret.angle = `${b.element.chain.match(/c/g).length - 1}${b.carbon - 1}-cpi`;
    else if(b.next == '~') ret.angle = `tri`;

    ret.to = build(b.element, b.idx, b.carbon, b.up);
    return ret;
  });

  return ret;
}
    
export default (parsed) => build(parsed, 0, 1, false);
