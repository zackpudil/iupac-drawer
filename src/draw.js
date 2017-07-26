const ext = (angle) => ({
  base: angle.replace(/(u|d)-/g, ''),
  ud: angle.replace(/-\w*/g, '')
});

const rot = (a, x) => {
  let { base, ud } = ext(a);
  var ang;

  if(base === 'tri') return 0;

  if(base === 'sig') {
    if(x == sx) ang = 30;
    else ang = 60;
  } else if(base.includes('pi')) {
    if(x == sx) ang = 0;
    else ang = base == 'tpi' ? -120 : 30;
  } else if(base.includes('tri')) ang = 0;

  return ang*(ud == 'u' ? -1 : 1);
};

const path = (a) => {
  let { base, ud } = ext(a);
  if(base == 'pi') {
    let u = ud == 'u' ? -5 : 5;
    return `h30m-30,${u}h30`
  } else if(base == 'tri') {
    return "h30m-30,5h30m-30,-10h30";
  }

  return "h30";
};

const draw = (build, x, y) => {
  let p = build.bonds.filter(b => b.to.type != 'h').map(b => `
    <g transform="rotate(${rot(b.angle, x)}, ${x}, ${y})">
      <path d="M${x},${y}${path(b.angle)}" />
      ${draw(b.to, x + 30, y)}
    </g>
  `).join('');
  return p.replace(/\s+(?![^<>]*>)/g, '');
};

var sx;

export default (build, startx, starty) => {
  sx = startx;
  return draw(build, startx, starty);
};
