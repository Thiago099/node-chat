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

const get_parameters = (req) => {
    const full_url = req.url;
    const raw_url = full_url.split('?');
    if(raw_url.length == 2) {
        const raw_params = raw_url[1];
        const params = raw_params.split('&');
        const result = {};
        params.forEach((param) => {
            const key_value = param.split('=');
            result[key_value[0]] = key_value[1];
        });
        return result;
    }
    return {}
}

app.ws('/echo', (ws, req) => {
    // get url parameters
    console.log(get_parameters(req))
    ws.on('message', (msg) => {
        // ws.send(msg);
        broadcast(echoWss, msg);
    });
})

const port = 3001
app.listen(port)
console.log(`Server listening on port ${port}`)