import express from 'express';

import parse from './parse';
import tree from './tree';
import model from './model';
import draw from './draw';

import * as util from 'util';

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
      ${draw(tree(model(parse(req.params.name))), 200, 200, req.query.scale)} 
    </svg>
  `); 
}); 

app.get('/test/:id', (req, res) => {
  res.redirect(`/${tests[req.params.id]}/draw`);
});

app.listen(5000);
