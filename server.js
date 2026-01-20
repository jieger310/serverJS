const express = require('express');
const mysql = require('mysql2');

const app = express();
let port = 443;

const connectdb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dell@mysql',
    database: 'user_db'
});

app.listen(port, () => {
    console.log("Server running on port "+port)
});

connectdb.connect((err) => {
    if(err){
        console.error("Not Connected!");
        return;
    }else{
        console.log("Connected!")
    }

});

app.use(express.json());

function Query(req, res, query, body, params){
    let value;
        if(body && params){
            value = [body, params]
        }else if(body && !params){
            value = [body]
        }else if(!body && params){
            value = [params]
        }

        connectdb.query(query, value, (error, result) => {

            if(error){
                return res.json(error);
            }
            res.json(result);
        })
}

app.get('/users', (req, res) => Query(req, res, 'SELECT * FROM users', false, false));
app.get('/products', (req, res) => Query(req, res, 'SELECT * FROM products', false, false));

app.get('/users/:id', (req, res) => Query(req, res, 'SELECT name FROM users WHERE id = ?', false, [req.params.id]))
app.get('/products/:id', (req, res) => Query(req, res, 'SELECT name FROM products WHERE id = ?', false, [req.params.id]))

app.post('/users', (req, res) => Query(req, res, 'INSERT INTO users (name) VALUES (?)', [req.body.name], false));
app.post('/products', (req, res) => Query(req, res, 'INSERT INTO products (name) VALUES (?)', [req.body.name], false));
