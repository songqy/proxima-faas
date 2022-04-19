import express from 'express';
import render from './render';
import build from '../build';

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

app.post('/', async (req, res) => {
  const body = req.body;
  console.log('body', body);
  const renderRes = await render(body);
  res.json(renderRes);
});

app.get('/404', (req, res) => {
  res.status(404).send('Not found');
});

app.get('/500', (req, res) => {
  res.status(500).send('Server Error');
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send('Internal Serverless Error');
});

app.listen(9000, () => {
  console.log(`Server start on http://localhost:9000`);
});
