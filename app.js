const http = require('http');
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const url = require('url');
const app = express();
const port = 3000;
var username;
// connect to database 
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "nocapongod99"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database");
});
// handle logging in
app.use(express.urlencoded({ extended: true }))
app.post('/log-in', (req, res) => {
    con.query(`USE doitinfo`, (err, results, fields) => {
        if (err) {
            console.log(err);
        }
        console.log(results);
    })
    con.query(`SELECT * FROM users WHERE user = '${req.body.username}'`, (err, result, fields) => {
        if (err) {
            console.log(err);
        }
        if (result.length != 0) {
            console.log("dupe detected");
            console.log(result.length);
        } else {
            con.query(`INSERT INTO users (user, silver, gold) VALUES ('${req.body.username}', 0, 0)`, (err, result, fields) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    })
    username = req.body.username;
    res.redirect(`/home`);
})
// will have one table for users, one table for categories with user ids associated, one table for tasks with categories associated with them
// serve static files from layout
app.use(express.static(path.join(__dirname, 'layout')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'layout', 'landing', 'landing.html'));
})

app.get('/home', (req, res) => {
    if (username != undefined) {
        res.sendFile(__dirname + `/layout/logged-in/home/home.html`);
    } else {
        res.redirect("/");
    }
})

app.get('/to-do', (req, res) => {
    if (username != undefined) {
        res.sendFile(__dirname + `/layout/logged-in/to-do/to-do.html`);
    } else {
        res.redirect("/");
    }
})
app.get('/to-do-css', (req, res) => {
    res.sendFile(__dirname + `/layout/logged-in/to-do/to-do.css`);
});
app.get('/to-do-js', (req, res) => {
    res.sendFile(__dirname + `/layout/logged-in/to-do/to-do.js`);
});

app.use(express.json());

app.post('/save-data', (req, res) => {
    let data = req.body;
    console.log(req.body);
    let userId = username;
    con.query(`DELETE FROM tasks WHERE user='${userId}'`, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log("deleting tasks: " , result);
    })
    con.query(`DELETE FROM categories WHERE user='${userId}'`, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log("deleting categories: " , result);
    })
    for (let [category, taskArray] of Object.entries(data)) {
        console.log(Object.entries(data));
        console.log(category);
        console.log(taskArray);
       con.query(`INSERT INTO categories (user, categoryName) VALUES ('${userId}', '${category}')`, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log("inserting categories: " , result);
       });
       for (let taskName of taskArray) {
            con.query(`INSERT INTO tasks (user, categoryName, taskName) VALUES ('${userId}', '${category}', '${taskName}')`, (err, result) => {
                if (err) {
                    console.log(err);
                }
            console.log("inserting tasks: ",result);
        })
       }
    }
})

app.get('/load-data', (req, res) => {
    con.query(`SELECT categoryName, taskName FROM tasks WHERE user='${username}'`, (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.json(rows);
    })
})

http.createServer(app).listen(port, 'localhost', (err) => {
    if (err) { console.log(err) };
    console.log("server listening on port " + port);
})