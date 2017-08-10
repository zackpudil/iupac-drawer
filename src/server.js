import express from 'express';

import parse from './parse';
import tree from './tree';
import model from './model';
import draw from './draw';

import { tests } from './tests';

import * as path from 'path';

let app = express();

app.use('/static', express.static(path.join(__dirname, '../static')));

app.get('/:name/draw', (req, res) => {
  res.send(`
    <svg height="500" width="500">
      <style>
        path {
          fill: none;
          stroke: black;
          stroke-width: 1;
      </style>
      ${draw(tree(model(parse(req.params.name))), 100, 150, req.query.scale)} 
    </svg>
  `); 
}); 

app.get('/test/:id', (req, res) => {
  res.send(tests[req.params.id]);
});


app.listen(5000);
