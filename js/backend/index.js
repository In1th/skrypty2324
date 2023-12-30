import express from 'express';
import { getDb, productsCount, setUpDb } from './db.js';
import cors from 'cors';
import {v4 as uuid} from 'uuid';

const app = express()
const port = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/products', async (req, res) => {
  const db = await getDb();

  let queryStr = 'SELECT * FROM Products ';
  
  if ('category' in req.query){
    queryStr = queryStr + `WHERE category = :cat `;
  }

  const offset = 20 * (parseInt(req.query.page ?? 1)-1);
  queryStr += `LIMIT 20 OFFSET ${offset}`;
  // console.log(queryStr)
  const data = await db.all(queryStr, {
    ':cat': req.query.category
  });
  res.send({
    products: data,
    total: await productsCount(req.query.category)
  });
})

app.get('/order', async (req, res) => {
  const db = await getDb();
  let data = await db.all('SELECT * FROM Orders LIMIT 5');
  res.send(data)
})

app.post('/buy', async (req, res) => {
  //validate
  console.log(req.body.body);

  const {person, phone, email, address, items} = req.body.body;

  const db = await getDb();
  const id = uuid();
  await db.run('INSERT INTO Orders VALUES (:id, :person, :phone, :email, :address, :products)', {
    ':id': id,
    ':person': person,
    ':email': email,
    ':phone': phone,
    ':address': address,
    ":products": JSON.stringify(items)
  })

  res.send({id});
  // order a thing
});

app.listen(port, async () => {
  await setUpDb();
  
  console.log(`Example app listening on port ${port}`)
})