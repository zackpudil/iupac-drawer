import express from 'express';
import Structure from './structure';

import Path from 'paths-js/path';

let app = express();

app.get('/', (req, res) => {
  res.send('IUPAC Drawer');
});

app.get('/draw', (req, res) => {

  let a = new Structure('2-decen-5-yne');
  a.addSubstituent('ethane', 3);
  a.addSubstituent('methane', 6);
  a.addSubstituent('methane', 2);
  a.addSubstituent('2-propene', 8);

  res.send(`
    <svg height="500" width="2000">
      <path d="${a.draw(Path()).print()}" stroke="black" fill="none" />
    </svg>
  `); 
}); 

app.listen(3000);
