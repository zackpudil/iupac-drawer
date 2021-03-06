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
  } else if (base == '2sig') ang = -90;
  else if(base.includes('pi') && !base.includes('c') && !base.includes('upi')) {
    if(x == sx) ang = 0;
    else ang = base.includes('tpi') ? -120 : 30;
  } else if(base.includes('tri')) ang = 0;
  else if(base == 'fsig' || base == 'fcupi') return 90*(ud == 'u' ? -1 : 1);
  else if(base == 'fupi') return 60*(ud == 'u' ? -1 : 1);
  else if(base.includes('c')) return cyclo(ud, base);

  return ang*(ud.includes('u') ? -1 : 1);
};

const path = (a, dx) => {
  let { base, ud } = ext(a);
  if(base == 'pi' || base == 'cpi' || base == 'ucpi') {
    let u = ud == 'u' ? -5 : 5;
    return `h${30 - dx}m${-28 + dx},${u}h${26 - dx}`;
  } else if (base.startsWith('u') && base.includes('pi') || base == 'fupi' || base == 'fcupi') {
    return "m0,2h30m-30,-4h30";
  } else if(base == 'tri') {
    return "h30m-30,5h30m-30,-10h30";
  }
  return `h${30 - dx}`;
};

const text = (type, up, x, y, angs, start = false) => {
  if(type == 'c') return '';

  let isRep = type.includes('x');
  let rot = -angs.reduce((a, b) => a + b, 0);

  var anchor, dy = 0;
  if(Math.abs(rot) == 90 || isRep)  {
    anchor = "middle"
    dy = rot > 0 ? 0 : 10;
  } else if(Math.abs(rot) > 90 || start) {
    anchor = "end"
    dy = 5;
  } else if(Math.abs(rot) < 90) {
    anchor = "start"
    dy = 5;
  }

  return `
    <text x="${x}" y="${y + (isRep ? 5 :  dy)}" 
        text-anchor="${anchor}" 
        transform="rotate(${rot}, ${x}, ${y})">
      ${type
        .replace(/^([a-z])/g, (n) => n.toUpperCase())
        .replace(/(x|X)/g, '')
        .replace(/\d/g, '')}
        <tspan baseline-shift="sub" style="font-size: 8px !important;">
          ${/(\d)/g.getMatch(type)}
        </tspan>
    </text>
  `;
};

const draw = (tree, x, y, angs) => {
  let p = x == sx ? text(tree.type, false, x, y, angs, true) : '';
  let fromNonCarbon = tree.type.includes('x');

  p += tree.bonds.filter(t => t.to.type != 'h').map(t => {

    let toNonCarbon = t.to.type.includes('x');
    let dx = fromNonCarbon ? 5 : 0;
    let tdx = toNonCarbon ? 5 : 0;

    if(tree.type.includes('H') && fromNonCarbon) dx += 5;
    if(t.to.type.includes('H') && toNonCarbon) tdx += 5;

    let r = rot(t.angle, x);
    let c_angs = [...angs, r];

    return `
      <g transform="rotate(${r}, ${x}, ${y})">
        <path d="M${x+dx},${y}${path(t.angle, dx + (tdx))}" />
        ${text(t.to.type, t.angle.includes('u'), x + 30, y, c_angs)}
        ${draw(t.to, x + 30, y, c_angs)}
      </g>`;
  }).join('');

  return p.replace(/\s+(?![^<>]*>)/g, '');
};

var sx;
export default (tree, startx, starty, scale = 1) => {
  sx = startx;

  return `
    <g transform="scale(${scale})">
      ${draw(tree, startx, starty, [])}
    </g>
  `;
};
