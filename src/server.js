import express from 'express';
import build from './builder';
import strip from './stripper';

import { tests } from './tests';

let app = express();

app.get('/', (req, res) => {
  res.send('IUPAC Drawer');
});

app.get('/draw', (req, res) => {
  res.send(`
    <svg height="1000" width="1000">
      <style>
        path {
          fill: none;
          stroke: black;
          stroke-width: 1;
      </style>
      ${build(strip(req.query.name)).print()} 
    </svg>
  `); 
}); 

app.get('/test/:id', (req, res) => {
  res.send(`
    <svg height="1000" width="1000">
      <style>
        path {
          fill: none;
          stroke: black;
          stroke-width: 1;
      </style>
      ${build(strip(tests[req.params.id])).print()} 
    </svg>
  `);
});

app.listen(3000);
