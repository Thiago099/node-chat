import './style.css'
const console = document.querySelector('#console')

var name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

var ws = new WebSocket("ws://localhost:3001/chat?name="+name);
// connect to websocket
// receive message from server
ws.onmessage = evt => {
    const {type, value} = JSON.parse(evt.data)
    switch(type) {
        case 'connected':
            console.innerHTML += `<p><span style='color:#0F0'>${value} connected</p>`
            break;
        case 'message':
            console.innerHTML += `<p><span style='color:#0FF'>${value}</p>`
            break;
        case 'disconnected':
            console.innerHTML += `<p><span style='color:#F00'>${value} disconnected</p>`
            break;
    }
};
ws.onopen = () => {
    console.innerHTML += '<p><span style="color:#0F0">connected</span></p>';
}
ws.onclose = () => {
    console.innerHTML += '<p><span style="color:#F00">Connection closed</span></p>';
}
setInterval(() => {
    ws.send(name);
}, 1000);
