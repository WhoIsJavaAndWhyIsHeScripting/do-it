const http = require('http');
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const port = 3000;
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
// will have one table for users, one table for categories with user ids associated, one table for tasks with categories associated with them
// serve static files from layout
app.use(express.static(path.join(__dirname, 'layout')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'layout', 'landing', 'landing.html'));
})

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'layout', 'logged-in', 'home', 'home.html'));
})

http.createServer(app).listen(port, 'localhost', (err) => {
    if (err) { console.log(err) };
    console.log("server listening on port " + port);
})