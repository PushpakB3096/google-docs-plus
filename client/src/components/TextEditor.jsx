import { useEffect, useRef } from "react";
import Quill from "quill";

import "quill/dist/quill.snow.css";

const TextEditor = () => {
  const wrapper = useRef();

  useEffect(() => {
    // creates an editor containersdsa for placing the quil editor inside including the toolbar
    const editor = document.createElement("div");
    wrapper.current.append(editor);

    new Quill(editor, { theme: "snow" });

    // before unmount, remove the quill editor
    return () => {
      wrapper.current.innerHTML = "";
    };
  }, []);

  return <div className='container' ref={wrapper}></div>;
};

export default TextEditor;
