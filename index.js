const app = require('express')();
expressWs = require('express-ws')(app);

//REST endpoint
app.get('/', (req, res) => {
    res.send('Hello World!');
});

var echoWss = expressWs.getWss('/echo');

const broadcast = (wss, message) => {
    wss.clients.forEach((client) => {
        client.send(message);
    });
}

app.ws('/echo', (ws, req) => {
    ws.on('message', (msg) => {
        // ws.send(msg);
        broadcast(echoWss, msg);
    });
})

const port = 3000
app.listen(port)
console.log(`Server listening on port ${port}`)