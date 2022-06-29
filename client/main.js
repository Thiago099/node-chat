import './style.css'
const console = document.querySelector('#console')
const chat_input = document.querySelector('#chat-input')

var name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

var ws = new WebSocket("ws://localhost:3001/chat?name="+name);
// connect to websocket
// receive message from server
ws.onmessage = evt => {
    const {type, value,target} = JSON.parse(evt.data)
    if(target == name) 
    {
        if(type == 'message'){
            console.innerHTML += '<p>You: <span style="color:#FF0">'+value+'</span></p>';
        }
    }
    else
    {
        switch(type) {
            case 'connected':
                console.innerHTML += `<p><span style='color:#0F0'>${value} connected</p>`
                break;
            case 'message':
                console.innerHTML += `<p>${target}: <span style='color:#0FF'>${value}</p>`
                break;
            case 'disconnected':
                console.innerHTML += `<p><span style='color:#F00'>${value} disconnected</p>`
                break;
        }
    }
    console.scrollTo(0, console.scrollHeight);
};
ws.onopen = () => {
    console.innerHTML += '<p><span style="color:#0F0">connected</span></p>';
}
ws.onclose = () => {
    console.innerHTML += '<p><span style="color:#F00">Connection closed</span></p>';
}

chat_input.addEventListener('keydown', (e) => {
    if(e.keyCode == 13) {
        ws.send(chat_input.value);
        chat_input.value = '';
    }
});