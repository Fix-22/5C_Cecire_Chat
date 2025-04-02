const fs = require('fs');
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { Server } = require('socket.io');
const conf = JSON.parse(fs.readFileSync("./conf.json"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/"))); //permette accesso a bootstrap all'applicazione lato client

const usersList = [];

const server = http.createServer(app);
const io = new Server(server);

server.listen(conf.port, () => {
    console.log("Server running on port: " + conf.port);
});

io.on("connection", socket => {
    console.log("Nuova connessione con id:", socket.id);
    io.emit("list", usersList);
    
    socket.on("message", messageEntity => {
        io.emit("chat", messageEntity.name + ": " + messageEntity.message);
    });

    socket.on("name", name => {
        usersList.push({"socketId": socket.id, "name": name});
        console.log("Utente aggiunto: " + name);
    });
});