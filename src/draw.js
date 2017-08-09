const ext = (angle) => ({
  base: angle.replace(/(u|d|\d+)-/g, ''),
  ud: angle.replace(/-\w*/g, '')
});

const cyclo = (n, a) => {
  if(n.startsWith('3')) return a.includes('u') ? -30 : 120;
  if(n == '41') return 0;
  if(n.startsWith('4')) return 90;

  if(n == '51') return a.includes('u') ? -60 : 30;
  if(n == '52' || n == '55') return 80;
  if(n == '53' || n == '54') return 70;

  if(n == '61') return a.includes('u') ? -60 : 30;
  if(n.startsWith('6')) return 60;
};

const rot = (a, x) => {
  let { base, ud } = ext(a);
  var ang;

  if(base === 'tri') return 0;

  if(base === 'sig' || base == "upi") {
    if(x == sx) ang = 30;
    else ang = 60;
  } else if(base.includes('pi') && !base.includes('c') && !base.includes('upi')) {
    if(x == sx) ang = 0;
    else ang = base.includes('tpi') ? -120 : 30;
  } else if(base.includes('tri')) ang = 0;
  else if(base == 'fsig' || base == 'fcupi') return 90*(ud == 'u' ? -1 : 1);
  else if(base == 'fupi') return 60*(ud == 'u' ? -1 : 1);
  else if(base.includes('c')) return cyclo(ud, base);

  return ang*(ud.includes('u') ? -1 : 1);
};

const path = (a, short) => {
  let { base, ud } = ext(a);
  if(base == 'pi' || base == 'cpi' || base == 'ucpi') {
    let u = ud == 'u' ? -5 : 5;
    return `h30m-28,${u}h26`;
  } else if (base.startsWith('u') && base.includes('pi') || base == 'fupi' || base == 'fcupi') {
    return "m0,2h30m-30,-4h30";
  } else if(base == 'tri') {
    return "h30m-30,5h30m-30,-10h30";
  }

  if(short) return "h25";
  return "h30";
};

const text = (type, up, x, y, start = false) => {
  if(type == 'c') return '';

  let isRep = type.includes('x');
  let rot = (isRep ? 30 : 0)*(up ? 1 : -1);
  rot = start ? 0 : rot;

  return `
    <text x="${x}" y="${y + 5}" 
      text-anchor="${isRep ? "middle" : start ? "end" :  "start"}" 
      transform="rotate(${rot}, ${x}, ${y})">
      ${type.replace(/^([a-z])/g, (n) => n.toUpperCase()).replace(/(x|X)/g, '')}
    </text>
  `;
};

const draw = (tree, x, y) => {
  let p = x == sx ? text(tree.type, false, x, y, true) : '';

  p += tree.bonds.filter(t => t.to.type != 'h').map(t => {
    let dx = tree.type.includes('x') ? 5 : 0;
    let shorten = tree.type.includes('x') || t.to.type.includes('x');
    return `
      <g transform="rotate(${rot(t.angle, x)}, ${x}, ${y})">
        <path d="M${x+dx},${y}${path(t.angle, shorten)}" />
        ${text(t.to.type, t.angle.includes('u'), x + 30, y)}
        ${draw(t.to, x + 30, y)}
      </g>
   `;
  }).join('');
  return p.replace(/\s+(?![^<>]*>)/g, '');
};

var sx;
export default (tree, startx, starty, scale = 1) => {
  sx = startx;

  return `
    <g transform="scale(${scale})">
      ${draw(tree, startx, starty)}
    </g>
  `;
};
