import './style.css'
const console_element = document.querySelector('#console')
const chat_input = document.querySelector('#chat-input')
const register_box_container = document.querySelector('#register-box-container')
const register_input = document.querySelector('#register-input')
const server = location.host.split(':')[0]+':3001'
import axios from 'axios'

register_input.addEventListener('keydown', register)
    
function register(e) {
    if(e.keyCode == 13) {
        register_input.removeEventListener('keydown', register)
        register_box_container.style.display = 'none';
        main(register_input.value)
    }
}
async function main(name)
{

    const history = (await axios.get('http://'+server+'/history')).data;
    for(const item of history) {
        add_message(item);
    }
    var id = 0;
    var ws = new WebSocket("ws://"+server+"/chat?name="+name);

    function add_message(message)
    {
        const {type, value, user, date} = message;
        const my_message = user.id == id

        switch(type) 
        {
            case 'connected':
                console_element.innerHTML += `<p><span style='color:#FAC'>${date}</span> <span style='color:${my_message?'#F0F':'#0F0'}'>${user.name} connected</p>`
                break;
            case 'message':
                console_element.innerHTML += `<p><span style='color:#FAC'>${date}</span> <span style='color:${my_message?'#FF0':'#0FF'}'>${user.name}:</span> ${value}</p>`
                break;
            case 'disconnected':
                console_element.innerHTML += `<p><span style='color:#FAC'>${date}</span> <span style='color:${my_message?'#FF0':'#F00'}'>${user.name} disconnected</p>`
                break;
            case 'config':
                id = user.id;
                break
        }
        console_element.scrollTo(0, console_element.scrollHeight);
    }
    ws.onmessage = evt => {
        add_message(JSON.parse(evt.data))
    };
    // ws.onopen = () => {
    // }
    ws.onclose = () => {
        register_box_container.style.display = 'block';
        register_input.addEventListener('keydown', register)
    }
    
    chat_input.addEventListener('keydown', (e) => {
        if(e.keyCode == 13) {
            ws.send(chat_input.value);
            chat_input.value = '';
        }
    });
}

