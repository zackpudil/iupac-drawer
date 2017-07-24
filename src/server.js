import express from 'express';
import draw from './drawer';
import build from './builder';
import strip from './stripper';
import parse from './parser';

import { tests } from './tests';

let app = express();

app.get('/', (req, res) => {
  res.send('IUPAC Drawer');
});

app.get('/:name/draw', (req, res) => {
  res.send(`
    <svg height="1000" width="1000">
      <style>
        path {
          fill: none;
          stroke: black;
          stroke-width: 1;
      </style>
      ${draw(build(strip(parse(req.params.name))), 200, 200)} 
    </svg>
  `); 
}); 

app.get('/test/:id', (req, res) => {
  res.redirect(`/${tests[req.params.id]}/draw`);
});

app.listen(3000);
