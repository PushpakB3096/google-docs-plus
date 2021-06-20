import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Quill from "quill";
import { io } from "socket.io-client";

import "quill/dist/quill.snow.css";

const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown

  ["bold", "italic", "underline", "strike"], // toggled buttons
  [{ list: "ordered" }, { list: "bullet" }],
  [{ direction: "rtl" }], // text direction

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["image", "blockquote", "code-block"],
  ["clean"] // remove formatting button
];

const TextEditor = () => {
  const [quill, setQuill] = useState(null);
  const [socket, setSocket] = useState(null);
  const wrapper = useRef();
  // getting the ID of the document from the route params
  const { id: documentId } = useParams();
  /* 
    this function will check if there are changes on the editor and if the changes are made by the current user,
    then send those changes to the server via the socket
    */
  const sendUserChangesToServer = (delta, oldDelta, source) => {
    /* 
        API changes means that the server sent some changes to the client. This happens when someone else is typing
        something on the same editor instance. Since this function is for sending current user's changes back to the
        server, we will ignore this event.
    */
    if (source === "api") return;

    // if the user itself made changes on the editor, send the changes to the server via socket event
    socket.emit("send-change", delta);
  };

  // everytime we receive some changes by other users, update the contents of the editor
  const updateEditor = delta => {
    quill.updateContents(delta);
  };

  const loadDocumentFromUser = document => {
    quill.setContents(document);
    quill.enable();
  };

  // this useEffect will run once on mount only
  useEffect(() => {
    // creates an editor containersdsa for placing the quil editor inside including the toolbar
    const editor = document.createElement("div");
    wrapper.current.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: toolbarOptions
      }
    });
    // disable the editor when created. we are enabling it later when we get some content to load from the server
    q.disable();
    // editor placeholder text
    q.setText("Loading document...");
    // set quill instance to the local state
    setQuill(q);

    // connecting to socket from the server
    // const sock = io("http://localhost:5000");
    const sock = io("https://google-docs-plus-api.herokuapp.com/");
    // setting the socket to the local state
    setSocket(sock);

    // before unmount
    return () => {
      // remove the quill editor
      wrapper.current.innerHTML = "";
      // disconnect from the socket
      sock.disconnect();
    };
  }, []);

  useEffect(
    () => {
      // if quill or the socket is not present on mount, just return
      if (quill === null || socket === null) return;

      // if user changes something on the editor, send it to the server
      quill.on("text-change", sendUserChangesToServer);

      // if some other user has made changes to the editor, update the current editor with the changes
      socket.on("receive-changes", updateEditor);

      // remove the event handler on unmount
      return () => {
        quill.off("text-change", sendUserChangesToServer);
        socket.off("receive-changes", updateEditor);
      };
    },
    // whenever the socket or the quill itself changes
    [socket, quill]
  );

  useEffect(() => {
    // if we don't have socket or the quill, don't proceed
    if (socket === null || quill === null) return;

    // sends the documentID to the server
    socket.emit("get-document", documentId);

    // 'once' will ensure that the handler runs once and then gets garbage collected
    // this will run once to load the document from the server
    socket.once("load-document", loadDocumentFromUser);
  }, [socket, quill, documentId]);

  // this useEffect is used to save the document every 2.5 seconds
  useEffect(() => {
    let interval = setInterval(() => {
      socket.emit("save-document", {
        data: quill.getContents(),
        documentId
      });
    }, 2500);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  return <div className='container' ref={wrapper}></div>;
};

export default TextEditor;
