export const composeExp = (rega, ...regs) => {
    let src = rega.source;
    regs.forEach((reg, idx) => {
        let key = `~${idx == 0 ? '' : idx}`;
        src = src.replace(key, reg.source ? reg.source : reg);
    });

    return new RegExp(src, 'g');
};

export const PREFIX = ['di', 'tri', 'tetr', 'pent', 'hex', 'hept', 'oct', 'non', 'dec'];
export const SUFFIX = ['ane', 'ene', 'yne', 'ol', 'al', 'one', 'oate', 'oic acid', 'amine'];
export const INFIX = ['meth', 'eth', 'prop', 'but', 'pent', 'hex', 'hept', 'oct', 'non', 'dec'];
export const SUB = ['yl', 'fluoro', 'chloro', 'bromo', 'iodo'];

export const FUNCTIONAL_GROUPS = [
    { sub: 'hydroxy', cyclosub: 'hydroxy', main: 'ol' },
    { sub: 'hydoro-$-oxo', cyclosub: '$-(1-hydoro-1-oxomethyl)', main: 'al' },
    { sub: 'oxo', cyclosub: 'oxo', main: 'one' },
    { sub: 'hydroxy-$-oxo', cyclosub: '$-(1-hydroxy-1-oxomethyl)', main: 'oic acid' }
];

export const SUB_TO_ELEMENT_MAP = {
    fluoro: 'f',
    chloro: 'cl',
    bromo: 'br',
    iodo: 'i',
    hydroxy: 'oH',
    hydoro: 'H',
    oxo: 'o'
};

const toRegexOr = (table) => new RegExp(`(?:${table.reduce((p, a, i) => p += i == 0 ? a : "|"+a, "")})`, 'g');

export const prefixOr = () => toRegexOr(PREFIX);
export const suffixOr = () => toRegexOr(SUFFIX);
export const infixOr = () => toRegexOr(INFIX)
export const subOr = () => toRegexOr(SUB);

const getIndex = (table, name) =>  table.findIndex(s => name.includes(s)) + 1;

export const prefixCount = (name) => getIndex(PREFIX, name);
export const suffixCount = (name) => getIndex(SUFFIX, name);
export const infixCount = (name) => getIndex(INFIX, name);
