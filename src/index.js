import express from 'express';
import {AlkylInterpreter} from './interpreter';

let app = express();

app.get('/', (req, res) => {
  res.send('IUPAC Drawer');
});

app.get('/draw', (req, res) => {
  let lineDiagram = new AlkylInterpreter().interpret(req.query.name);
  res.send('<svg height="1000" width="1000"><path d="M100 100' + lineDiagram.draw().toLowerCase() + '" stroke="black" fill="none" /></svg>');
});

app.listen(3000);
