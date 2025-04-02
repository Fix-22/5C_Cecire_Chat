const chat = document.getElementById("chat");
const inputMessage = document.getElementById("inputMessage");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");
const openModalButton = document.getElementById("openModalButton");
const enterButton = document.getElementById("enterButton");
const inputName = document.getElementById("inputName");
const usersTable = document.getElementById("usersTable");
const modal = new bootstrap.Modal(document.getElementById("modal"));

const messageTemplate = '<li class="list-group-item">%MESSAGE</li>';
const rowTemplate = "<tr><td>%NAME</td></tr>";

const messages = [];
let usersList = [];
let username = "";

const socket = io();

enterButton.onclick = () => {
    if (inputName.value) {
        username = inputName.value;
        socket.emit("name", username);
        chat.classList.remove("d-none");
        modal.hide();
        openModalButton.classList.add("d-none");
    }
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

socket.on("list", list => {
    usersList = list;
    renderList();
});

socket.on("chat", (message) => {
    messages.push(message);
    renderChat();
})

const renderList = () => {
    let html = "<tr><th>Utenti connessi</th></tr>";

    usersList.forEach(e => {
        html += rowTemplate.replace("%NAME", e.name + (socket.id === e.socketId ? " (tu)" : ""));
    });
    usersTable.innerHTML = html;
};

const renderChat = () => {
    let html = "";
    messages.forEach((message) => {
        const row = messageTemplate.replace("%MESSAGE", message);
        html += row;
    });
    chatMessages.innerHTML = html;
    window.scrollTo(0, document.body.scrollHeight);
}