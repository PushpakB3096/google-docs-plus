const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// connecting to mongoDB atlas via mongoose
mongoose
  .connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err =>
    console.error("Some error occurred while connecting to MongoDB Atlas")
  );

io.on("connection", socket => {
  socket.on("get-document", documentId => {
    // sets the data to be sent back to the client
    const data = "";
    /*
      On first time load, we need to put the socket in its own room having the ID of documentId.
      Any other socket can join the same room if they have the room ID.
    */
    socket.join(documentId);
    socket.emit("load-document", data);

    // if the socket has some changes on the editor sent by the client
    socket.on("send-change", delta => {
      // Broadcast means send the changes to all the users in the room ID
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });
  });
});
