const chatForm = document.getElementById("chatForm");
const inputMessage = document.getElementById("inputMessage");
const sendButton = document.getElementById("sendButton");
const chat = document.getElementById("chat");
const openModalButton = document.getElementById("openModalButton");
const enterButton = document.getElementById("enterButton");
const inputName = document.getElementById("inputName");

const template = '<li class="list-group-item">%MESSAGE</li>';
const messages = [];
let username = "";

const socket = io();

enterButton.onclick = () => {
    username = inputName.value;
    socket.emit("name", username);
    chatForm.classList.remove("d-none");
};

inputMessage.onkeydown = (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendButton.click();
    }
}

sendButton.onclick = () => {
    if (inputMessage.value) {
        socket.emit("message", {name: username, message: inputMessage.value});
        inputMessage.value = "";
    }
}

socket.on("chat", (message) => {
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