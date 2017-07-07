import express from 'express';
import {AlkylInterpreter} from './interpreter';

import { Alkyl } from './alkyl'

let app = express();

app.get('/', (req, res) => {
  res.send('IUPAC Drawer');
});

app.get('/draw', (req, res) => {
  let a = new AlkylInterpreter().interpret(req.query.name);
  //let a = new Alkyl(150, 300);
  //a.addAlkane().addAlkane().addAlkene(false).addAlkane().addAlkene(true).addAlkane().addAlkyne().addAlkane().addAlkane(); 
  res.send('<svg height="500" width="1000"><path d="' + a.draw() + '" stroke="black" fill="none" /></svg>'); 
}); 

app.listen(3000);
