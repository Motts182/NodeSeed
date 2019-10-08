const express = require('express');

const app = express();

const port = process.env.port || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to my appi NODEMON');
});

app.listen(port, () => {
  console.log(`Running on port  + ${port}`);
});
