import express from 'express';
import Structure from './structure';
import Interpreter from './interpreter';

import Path from 'paths-js/path';

let app = express();

app.get('/', (req, res) => {
  res.send('IUPAC Drawer');
});

app.get('/draw', (req, res) => {

  let a = new Structure('2-decen-5-yne')
    .addSubstituent('ethane', 3)
    .addSubstituent('methane', 6)
    .addSubstituent('methane', 2)
    .addSubstituent('propane', 8);

  new Interpreter().interpret(req.query.name);

  res.send(`
    <svg height="500" width="2000">
      <path d="${a.draw(Path()).print()}" stroke="black" fill="none" />
    </svg>
  `); 
}); 

app.listen(3000);
