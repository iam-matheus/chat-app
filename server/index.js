const express = require("express");
const app = express();
const PORT = 4000;

//importing the http and CORS library to allow data transfer between the client and server domains
const http = require("http").Server(app);
const cors = require("cors");

//following, import socket.io to create a real time connection.
let socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors()); //instantiating the cors library
let users = [];
/*
From the code snippet below, the socket.io("connection") function
establishes a connection with the React app, then creates a unique ID for
each socket and logs the ID to the console whenever a user visits the web page.

When you refresh or close the web page, the socket fires the disconnect event showing that a user has disconnected from the socket.
*/

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  //Listens when a new user joins the server
  socket.on("newUser", (data) => {
    //Adds the new user to the list of users
    users.push(data);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit("newUserResponse", users);
  });

  //listens to the messages from the event in the react app and
  //sends the message to all the users on the server
  socket.on("message", (data) => {
    socketIO.emit("messageResponse", data);
  });

  socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

  socket.on("disconnect", () => {
    console.log(`🔥: A user @ ${socket.id} disconnected`);

    //updates the array of users when one leaves
    users = users.filter((user) => user.socketID !== socket.id);
    //updates the client
    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });

  /**
   * socket.on("newUser") is triggered when a new user joins the chat application. 
   * The user's details (socket ID and username) are saved into the users array and sent 
   * back to the React app in a new event named newUserResponse.
   * 
    In socket.io("disconnect"), the users array is updated when a user leaves the chat application, 
    and the newUserReponse event is triggered to send the updated the list of users to the client.
   */
});

// create a GET route
app.get("/api", (req, res) => {
  console.log("printing from the server");
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});

http.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});
