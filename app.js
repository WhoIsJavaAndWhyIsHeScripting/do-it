const http = require('http');
const express = require('express');
const session = require ('express-session');
const path = require('path');
const mysql = require('mysql2');
const url = require('url');
const app = express();
const port = process.env.PORT || 3000;
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
app.use(session({}));
// handle logging in
app.use(express.urlencoded({ extended: true }))
app.post('/log-in', (req, res) => {
    req.session.username = req.body.username;
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
    res.redirect(`/home?user=${req.body.username}`);
})
// will have one table for users, one table for categories with user ids associated, one table for tasks with categories associated with them
// serve static files from layout
app.use(express.static(path.join(__dirname, 'layout')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'layout', 'landing', 'landing.html'));
})

app.get('/home', (req, res) => {
    if (req.session.username != undefined) {
        res.sendFile(__dirname + `/layout/logged-in/home/home.html`);
    } else {
        res.redirect("/");
    }
})

app.get('/to-do', (req, res) => {
    if (req.session.username != undefined) {
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
    var entries = Object.entries(data);
    console.log(req.body);
    con.query(`DELETE FROM tasks WHERE user='${req.session.username}'`, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log("deleting tasks: " , result);
    })
    con.query(`DELETE FROM categories WHERE user='${req.session.username}'`, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log("deleting categories: " , result);
    })
    for (let [category, taskArray] of entries) {
        console.log(category);
        console.log(taskArray);
       con.query(`INSERT INTO categories (user, categoryName) VALUES ('${req.session.username}', '${category}')`, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log("inserting categories: " , result);
       });
       for (let taskName of taskArray) {
            con.query(`INSERT INTO tasks (user, categoryName, taskName) VALUES ('${req.session.username}', '${category}', '${taskName}')`, (err, result) => {
                if (err) {
                    console.log(err);
                }
            console.log("inserting tasks: ",result);
        })
       }
    }
})

app.use(express.json());

app.post('/save-currency', (req, res) => {
    let data = req.body;
    console.log(data);
    con.query(`UPDATE users SET silver = ${data[0]}, gold = ${data[1]} WHERE user = '${req.session.username}'`, (err, result) => {
        if (err) {
            console.log(data);
            console.log("error updating currency", err);
        }
        console.log(result);
    })
})

app.get('/load-categories', (req, res) => {
    con.query(`SELECT categoryName FROM categories WHERE user='${req.session.username}'`, (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.json(rows);
    })
});
app.get('/load-tasks', (req, res) => {
    con.query(`SELECT categoryName, taskName FROM tasks WHERE user='${req.session.username}'`, (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.json(rows);
    })
})

app.get('/load-currency', (req, res) => {
    con.query(`SELECT silver, gold FROM users WHERE user='${req.session.username}'`, (err, rows) => {
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