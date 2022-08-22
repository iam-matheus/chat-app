const express = require("express");
const app = express();
const PORT = 4000;

//importing the http and CORS library to allow data transfer between the client and server domains
const http = require("http").Server(app);
const cors = require("cors");

app.use(cors()); //instantiating the cors library

//following, import socket.io to create a real time connection.
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost/3000",
  },
});

/*
From the code snippet below, the socket.io("connection") function
establishes a connection with the React app, then creates a unique ID for
each socket and logs the ID to the console whenever a user visits the web page.

When you refresh or close the web page, the socket fires the disconnect event showing that a user has disconnected from the socket.
*/

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  //listens to the messages from the event in the react app and
  //sends the message to all the users on the server
  socket.on("message", (data) => {
    socketIO.emit("messageResponse", data);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

//this code currently returns a json object when /api is requested
app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});
