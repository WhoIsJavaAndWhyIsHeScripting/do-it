const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
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