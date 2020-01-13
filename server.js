const express = require('express');
const path = require('path')
const port = process.env.PORT || 8080;
const app = express();
var https = require('https');
var http = require('http');


app.use(express.static(__dirname));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../gemx-web/public/index.html'))
});

// https.createServer(app).listen(443);
http.createServer(app).listen(port);

console.log('Server started')