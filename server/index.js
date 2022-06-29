const app = require('express')();
expressWs = require('express-ws')(app);
app.use(require('cors')())

var echoWss = expressWs.getWss('/chat');

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
const history = []
function send(message)
{
    history.push(message);
    broadcast(echoWss, JSON.stringify(message));
}

app.get('/history', (req, res) => {
    res.send(JSON.stringify(history));
});


let last_id = 1;
app.ws('/chat', (ws, req) => {
    // get url parameters
    const {name} = get_parameters(req)
    const id = last_id++;
    const user = {id, name};
    // get connection id
    ws.send(JSON.stringify({type:"config",user}))
    send({type:"connected",user})
    ws.on('message', (msg) => {
        // ws.send(msg);
        if(msg != '')
        {
            send({type:"message",user,value:msg})
        }
    });
    ws.on('close', ()=>{
        send({type:"disconnected",user})
    })
})

const port = 3001
app.listen(port)
console.log(`Server listening on port ${port}`)