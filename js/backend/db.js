import SQL from 'sql-template-strings';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import {v4 as uuid} from 'uuid';
import {faker} from '@faker-js/faker';

export const getDb = async () => open({
    filename: './db.sql',
    driver: sqlite3.Database
});

export const productsCount = async (cat) => {
    const db = await getDb();
    let queryStr = 'SELECT COUNT(*) FROM Products';
    if (cat) {
        queryStr += ` WHERE category = :cat`
    }
    return (await db.get(queryStr, {':cat': cat}))["COUNT(*)"];
}

export const setUpDb = async () => {
    const db = await getDb();
    // await db.run('DROP TABLE IF EXISTS Orders');
    await db.run(SQL`CREATE TABLE IF NOT EXISTS Products (
     id varchar(36) PRIMARY KEY NOT NULL,
     name TEXT NOT NULL,
     imageUrl TEXT NOT NULL,
     quantity INT NOT NULL,
     price FLOAT NOT NULL ,
     category TEXT,
     description TEXT
    )`);
    await db.run(SQL`CREATE TABLE IF NOT EXISTS Orders (
     id varchar(16) PRIMARY KEY NOT NULL,
     person TEXT NOT NULL,
     phone TEXT NOT NULL,
     email TEXT NOT NULL,
     address TEXT NOT NULL,
     prodcuts TEXT NOT NULL
    )`);

    if (process.argv.indexOf('--populate') !== -1){
        console.log('Populating products');
        const categories = [
            'CategoryA',
            'CategoryB',
            'CategoryC',
            'CategoryD',
            'CategoryE',
        ]

        for (let i = 0; i < 100; i++){
            await db.run(`INSERT INTO Products VALUES (:id, :name, :image, :quantity, :price, :category, :description)`, {
                ':id': uuid(),
                ':name': faker.commerce.productName(),
                ':image': faker.image.url(),
                ':quantity': faker.number.int({min: 0, max: 10}),
                ':price': faker.commerce.price(),
                ':category': faker.helpers.arrayElement(categories),
                ':description': faker.commerce.productDescription()
            });
        }
    }

}