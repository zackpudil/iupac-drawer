import express from 'express';
import Structure from './structure';
import Interpreter from './interpreter';
import Vector from './vector';

import Path from 'paths-js/path';

let app = express();

app.get('/', (req, res) => {
  res.send('IUPAC Drawer');
});

app.get('/draw', (req, res) => {

  /*let a = new Structure('2-decen-5-yne', new Vector(150, 200))
    .addSubstituent('ethane', 3)
    .addSubstituent('methane', 6)
    .addSubstituent('methane', 2)
    .addSubstituent('propane', 8);*/

  let a = new Interpreter().interpret(req.query.name, new Vector(150, 200));

  res.send(`
    <svg height="1000" width="1000">
      <path d="${a.draw(Path()).print()}" stroke="black" fill="none" />
    </svg>
  `); 
}); 

app.listen(3000);
