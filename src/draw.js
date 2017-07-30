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

  if(base === 'sig') {
    if(x == sx) ang = 30;
    else ang = 60;
  } else if(base.includes('pi') && !base.includes('c')) {
    if(x == sx) ang = 0;
    else ang = base == 'tpi' ? -120 : 30;
  } else if(base.includes('tri')) ang = 0;
  else if(base == 'fsig') return -90;
  else if(base.includes('c')) return cyclo(ud, base);

  return ang*(ud.includes('u') ? -1 : 1);
};

const path = (a) => {
  let { base, ud } = ext(a);
  if(base == 'pi' || base == 'cpi' || base == 'ucpi') {
    let u = ud == 'u' ? -5 : 5;
    return `h30m-28,${u}h26`;
  } else if(base == 'tri') {
    return "h30m-30,5h30m-30,-10h30";
  }

  return "h30";
};

const text = (type, angle, x, y) => {
  if(type == 'c') return '';

  let [ang, dx, dy] = [0,0,0];
  let u = angle.includes('u') ? -1 : 1;

  if(angle.includes('sig')) [ang, dx, dy] = [90*-u, type.length == 1 ? 3 : 5, u == 1 ? 10 : 0];
  else if(angle.includes('tpi')) [ang, dx, dy] = [150*u, type.length == 1 ? 10 : 15, 5];
  else if(angle.includes('spi')) [ang, dx, dy] = [30*-u, 0, 5];
  else if(angle == 'start') [ang, dx, dy] = [0, type.length == 1 ? 10 : 15, 5];

  return `
    <text x="${x - dx}" y="${y + dy}" transform="rotate(${ang}, ${x}, ${y})">
      ${type.replace(/^([a-z])/g, (n) => n.toUpperCase())}
    </text>
  `;
};

const draw = (tree, x, y) => {
  let p = x == sx ? text(tree.type, 'start', x, y) : '';
  p += tree.bonds.filter(t => t.to.type != 'h').map(t => `
    <g transform="rotate(${rot(t.angle, x)}, ${x}, ${y})">
      <path d="M${x},${y}${path(t.angle)}" />
      ${text(t.to.type, t.angle, x + 30, y)}
      ${draw(t.to, x + 30, y)}
    </g>
  `).join('');
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
