var express = require('express');
var webSocket = require('ws');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');

const app = express();
const port = 3000;
const server = http.createServer(app);
const wss = new webSocket.Server({ server });
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

wss.on('connection', ((ws) => {
    ws.on('message', (message) => {
        wss.broadcast(`received: ${message}`)
    });

    ws.on('end', () => {
        console.log('Connection ended...');
    });

    ws.send('Hello Client');
}));

wss.broadcast = function broadcast(msg) {
    console.log(msg);
    wss.clients.forEach((client) => {
        if (client.readyState === webSocket.OPEN) {
            client.send(msg);
        }
    });
};

app.get('/client/:id', (req, res) => {
    res.sendFile(path.resolve(__dirname, `./public/client-${req.params.id}.html`));
});

/* app.get('/external-api', (req, res) => {
    wss.clients.forEach((client) => {
        if (client.readyState === webSocket.OPEN) {
            client.send('Coucou');
        }
    });
    res.sendStatus(200);
}); */


server.listen(port, () => console.log(`http server is listening on http://localhost:${port}`));