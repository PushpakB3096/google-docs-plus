const mongoose = require("mongoose");
const dotenv = require("dotenv");

const { findOrCreateDoc, updateDoc } = require("./utils/documents");

dotenv.config();

const io = require("socket.io")(process.env.PORT || 5000, {
  cors: {
    origin: "*",
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

mongoose.set("useFindAndModify", false);

io.on("connection", socket => {
  socket.on("get-document", async documentId => {
    // sets the data to be sent back to the client
    const { data } = await findOrCreateDoc(documentId);

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

    // on save request emitted by the client, update the document
    socket.on("save-document", updateDoc);
  });
});
