import { useEffect, useRef, useState } from "react";
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
    // set quill instance to the local state
    setQuill(q);

    // connecting to socket from the server
    const sock = io("http://localhost:3001");
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

  return <div className='container' ref={wrapper}></div>;
};

export default TextEditor;
