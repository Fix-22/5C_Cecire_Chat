const chatInputContainer = document.getElementById("chatInputContainer");
const inputMessage = document.getElementById("inputMessage");
const sendButton = document.getElementById("sendButton");
const chat = document.getElementById("chat");
const openModalButton = document.getElementById("openModalButton");
const enterButton = document.getElementById("enterButton");
const inputName = document.getElementById("inputName");

const template = '<li class="list-group-item">%MESSAGE</li>';
const messages = [];

const socket = io();

enterButton.onclick = () => {
    socket.emit("name", inputName.value);
};

inputMessage.onkeydown = (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendButton.click();
    }
}

sendButton.onclick = () => {
    socket.emit("message", inputMessage.value);
    inputMessage.value = "";
}

socket.on("chat", (message) => {
    console.log(message);
    messages.push(message);
    render();
})

const render = () => {
    let html = "";
    messages.forEach((message) => {
        const row = template.replace("%MESSAGE", message);
        html += row;
    });
    chat.innerHTML = html;
    window.scrollTo(0, document.body.scrollHeight);
}