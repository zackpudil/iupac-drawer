import { Alkyl, Alkene, Alkane, LL } from './alkyl';
import { AlkylInterpreter } from './interpreter';
import Vector from './vector';

import Path from 'paths-js/path';

export default class Structure {
  constructor(mainChainName, startCoord) {
    this.substituents = [];

    this.interpreter = new AlkylInterpreter();
    this.mainChain = this.interpreter.interpret(mainChainName, startCoord, 0);
  }

  addSubstituent(alkylName, index) {
    let carbon = this.mainChain.bonds[index];
    var startCoord;
    
    if(carbon instanceof Alkane && this.mainChain.bonds[index - 1] instanceof Alkane) {
      startCoord = carbon.coord.add(new Vector(0, carbon.up ? -LL : LL));
    } else if(carbon instanceof Alkene && this.mainChain.bonds[index-1] instanceof Alkane) {
      startCoord = carbon.coord.add(new Vector(-LL, this.mainChain.bonds[index - 1].up ? LL : -LL));
    } else {
      startCoord = carbon.coord.add(new Vector(LL, carbon.up ? -LL : LL));
    }
    let alkyl = this.interpreter.interpret(alkylName, startCoord, carbon.up ? 1 : 2);

    this.substituents.push({ alkyl: alkyl, coord: carbon.coord });
    debugger;
    return this;
  }

  draw(path) {
    path = this.mainChain.draw(path);
    this.substituents.forEach(c => {
      path = path.moveto(c.coord);
      path = path.lineto(c.alkyl.startCoord);
      path = c.alkyl.draw(path)
    });
    return path;
  }
}
