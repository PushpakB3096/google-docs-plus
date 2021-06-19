import { useEffect, useRef } from "react";
import Quill from "quill";

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
  const wrapper = useRef();

  useEffect(() => {
    // creates an editor containersdsa for placing the quil editor inside including the toolbar
    const editor = document.createElement("div");
    wrapper.current.append(editor);

    new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: toolbarOptions
      }
    });

    // before unmount, remove the quill editor
    return () => {
      wrapper.current.innerHTML = "";
    };
  }, []);

  return <div className='container' ref={wrapper}></div>;
};

export default TextEditor;
