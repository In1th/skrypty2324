import express from 'express';
const app = express()
const port = process.env.PORT ?? 3001;

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/products', (req, res) => {
  //all with or without all param

  //if category param, only get category
  console.log(req.query)
  res.send('Hello World!')
})

app.get('/orders', (req, res) => {
  //get all orders for user
})

app.post('/buy', (req, res) => {
  //validate
  // order a thing
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})