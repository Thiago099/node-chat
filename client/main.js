import './style.css'
const console = document.querySelector('#console')
var ws = new WebSocket("ws://localhost:3001/echo?id=0");
// connect to websocket
// receive message from server
ws.onmessage = evt => {
    console.innerHTML += "<span style='color:#0FF'>"+ evt.data + '</span><br>';
};
ws.onopen = () => {
    console.innerHTML += '<span style="color:#0F0">connected</span><br>';
}
ws.onclose = () => {
    console.innerHTML += '<span style="color:#F00">Connection closed</span><br>';
}
var str = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
setInterval(() => {
    ws.send(str);
}, 1000);
