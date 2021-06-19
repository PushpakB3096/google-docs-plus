const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", socket => {
  // if the socket has some changes on the editor sent by the client
  socket.on("send-change", delta => {
    // Broadcast means send the changes to all the users except us
    socket.broadcast.emit("receive-changes", delta);
  });
});
