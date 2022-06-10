import express from 'express';
import render from './render';
import build from '../build';
import { testComplieMain, testComplieApp } from './test-c';

import 'dotenv/config';

// 打包编译前端代码
build();

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Routes
app.get(`/`, async (req, res) => {
  const renderRes = await render();
  res.json(renderRes);
});

app.post('/', async (req, res, next) => {
  const body = req.body;
  console.log('body', body);
  try {
    const renderRes = await render(body);
    res.json(renderRes);
  } catch (err) {
    // console.log('err', err);
    if (err instanceof Error) {
      const renderRes = {
        message: 'Internal Server Error',
        stack: err.stack,
      };
      res.json(renderRes);
    }
  }
});

const MAX = 1000;

app.get('/stress', async (req, res) => {
  try {
    const startTime = Date.now();
    const p = [];
    for (let i = 0; i < MAX; ++i) {
      p.push(render());
    }
    await Promise.all(p);
    const endTime = Date.now();
    res.json({
      cost: endTime - startTime,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
});

app.get('/stress-c', async (req, res) => {
  try {
    const startTime = Date.now();
    // await testComplieMain();
    await testComplieApp();
    const endTime = Date.now();
    res.json({
      cost: endTime - startTime,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
});

app.get('/404', (req, res) => {
  res.status(404).send('Not found');
});

app.get('/500', (req, res) => {
  res.status(500).send('Server Error');
});

// Error handler
// app.use(function (err, req, res) {
//   console.error(err);
//   res.res.send('Internal Serverless Error');
// });

app.listen(9000, () => {
  console.log(`Server start on http://localhost:9000`);
});
