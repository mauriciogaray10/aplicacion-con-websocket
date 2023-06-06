import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";

const app = express();
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);

const expressServer = app.listen(8080, () => console.log("Listening"));
const socketServer = new Server(expressServer);

const mensajes = [];
socketServer.on("connection", (socket) => {
  console.log("connected " + socket.id);
 
  socket.on("message", (data) => {
    console.log(data)
    mensajes.push(data);
    socketServer.emit("imprimir", mensajes);
  });

  socket.on('authenticatedUser', (data)=>{
    socket.broadcast.emit('newUserAlert', data)
  })
});