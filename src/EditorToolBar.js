import React from 'react';
import {
  CLEAR_ERROR,
  CLEAR_SUCCESS,
  ERROR,
  FIELD,
  RESET,
  SUCCESS,
  TIME_FOR_CLEARING_SETTIMEOUT,
  UPDATE_ALL_DOCUMENTS,
} from './documentReducer';
import { getFetchURL } from './utils/getFetchURL';
// import { Quill } from "react-quill";

// Custom Undo button icon component for Quill editor. You can import it directly
// from 'quill/assets/icons/undo.svg' but I found that a number of loaders do not
// handle them correctly
// const CustomUndo = () => (
//   <svg viewBox="0 0 18 18">
//     <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
//     <path
//       className="ql-stroke"
//       d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
//     />
//   </svg>
// );
//
// // Redo button icon component for Quill editor
// const CustomRedo = () => (
//   <svg viewBox="0 0 18 18">
//     <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
//     <path
//       className="ql-stroke"
//       d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
//     />
//   </svg>
// );

const SaveText = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-save"
    viewBox="0 0 16 16"
  >
    <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
  </svg>
);

const ClearDocument = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-trash"
    viewBox="0 0 16 16"
  >
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
    <path
      fillRule="evenodd"
      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
    />
  </svg>
);

// Undo and redo functions for Custom Toolbar
// function undoChange() {
//   this.quill.history.undo();
// }
// function redoChange() {
//   this.quill.history.redo();
// }
// function logQuillText() {
//   console.log(this.quill.root.innerHTML);
// }

function saveToDatabase({
  documentId: id,
  documentName: name,
  editorText: html,
  dispatch,
}) {
  let requestOptions;
  let fetchURL = getFetchURL();
  if (!id) {
    fetchURL = `${fetchURL}/create`;
    requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        html,
      }),
    };
  } else {
    fetchURL = `${fetchURL}/update`;
    requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        name,
        html,
      }),
    };
  }
  const type = FIELD;
  const fieldName = 'documentId';
  if (name) {
    fetch(fetchURL, requestOptions)
      .then((response) => response.json())
      .then((result) =>
        result.data
          ? result.data.id
            ? (dispatch({
                type,
                fieldName,
                payload: result.data.id,
              }),
              dispatch({
                type: UPDATE_ALL_DOCUMENTS,
                payload: { _id: result.data.id, name, html },
              }))
            : (dispatch({
                type,
                fieldName,
                payload: result.data.value._id,
              }),
              dispatch({
                type: UPDATE_ALL_DOCUMENTS,
                payload: { _id: result.data.value._id, name, html },
              }))
          : //  setDocumentId(result.data.id)
            (console.error(result.errors.message),
            dispatch({ type: ERROR, payload: result.errors.message }),
            setTimeout(() => {
              dispatch({ type: CLEAR_ERROR });
            }, TIME_FOR_CLEARING_SETTIMEOUT))
      )
      .catch((error) => {
        dispatch({ type: ERROR, payload: error.message });
        setTimeout(() => {
          dispatch({ type: CLEAR_ERROR });
        }, TIME_FOR_CLEARING_SETTIMEOUT);
      });
  } else {
    dispatch({ type: ERROR, payload: 'Document name is empty' });
    setTimeout(() => {
      dispatch({ type: CLEAR_ERROR });
    }, TIME_FOR_CLEARING_SETTIMEOUT);
    console.error('Document name is empty');
  }
}

// Add sizes to whitelist and register them
// const Size = Quill.import("formats/size");
// Size.whitelist = ["extra-small", "small", "medium", "large"];
// Quill.register(Size, true);

// Add fonts to whitelist and register them
// const Font = Quill.import("formats/font");
// Font.whitelist = [
//   "arial",
//   "comic-sans",
//   "courier-new",
//   "georgia",
//   "helvetica",
//   "lucida"
// ];
// Quill.register(Font, true);

// Modules object for setting up the Quill editor
export const modules = {
  toolbar: {
    container: '#toolbar',
    handlers: {
      // undo: undoChange,
      // redo: redoChange,
      // save: saveToDatabase,
    },
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
};

// Formats objects for setting up the Quill editor
export const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'align',
  'strike',
  'script',
  'blockquote',
  'background',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color',
  'code-block',
];

// Quill Toolbar component
export const QuillToolbar = ({
  documentName,
  editorText,
  documentId,
  dispatch,
}) => {
  return (
    <div id="toolbar">
      {/* <span className="ql-formats"> */}
      {/*   <select className="ql-font" defaultValue="arial"> */}
      {/*     <option value="arial">Arial</option> */}
      {/*     <option value="comic-sans">Comic Sans</option> */}
      {/*     <option value="courier-new">Courier New</option> */}
      {/*     <option value="georgia">Georgia</option> */}
      {/*     <option value="helvetica">Helvetica</option> */}
      {/*     <option value="lucida">Lucida</option> */}
      {/*   </select> */}
      {/*   <select className="ql-size" defaultValue="medium"> */}
      {/*     <option value="extra-small">Size 1</option> */}
      {/*     <option value="small">Size 2</option> */}
      {/*     <option value="medium">Size 3</option> */}
      {/*     <option value="large">Size 4</option> */}
      {/*   </select> */}
      {/*   <select className="ql-header" defaultValue="3"> */}
      {/*     <option value="1">Heading</option> */}
      {/*     <option value="2">Subheading</option> */}
      {/*     <option value="3">Normal</option> */}
      {/*   </select> */}
      {/* </span> */}
      {/* <span className="ql-formats"> */}
      {/*   <button className="ql-bold" /> */}
      {/*   <button className="ql-italic" /> */}
      {/*   <button className="ql-underline" /> */}
      {/*   <button className="ql-strike" /> */}
      {/* </span> */}
      {/* <span className="ql-formats"> */}
      {/*   <button className="ql-list" value="ordered" /> */}
      {/*   <button className="ql-list" value="bullet" /> */}
      {/*   <button className="ql-indent" value="-1" /> */}
      {/*   <button className="ql-indent" value="+1" /> */}
      {/* </span> */}
      {/* <span className="ql-formats"> */}
      {/*   <button className="ql-script" value="super" /> */}
      {/*   <button className="ql-script" value="sub" /> */}
      {/*   <button className="ql-blockquote" /> */}
      {/*   <button className="ql-direction" /> */}
      {/* </span> */}
      {/* <span className="ql-formats"> */}
      {/*   <select className="ql-align" /> */}
      {/*   <select className="ql-color" /> */}
      {/*   <select className="ql-background" /> */}
      {/* </span> */}
      {/* <span className="ql-formats"> */}
      {/*   <button className="ql-link" /> */}
      {/*   <button className="ql-image" /> */}
      {/*   <button className="ql-video" /> */}
      {/* </span> */}
      {/* <span className="ql-formats"> */}
      {/*   <button className="ql-formula" /> */}
      {/*   <button className="ql-code-block" /> */}
      {/*   <button className="ql-clean" /> */}
      {/* </span> */}
      {/* <span className="ql-formats"> */}
      {/*   <button className="ql-undo"> */}
      {/*     <CustomUndo /> */}
      {/*   </button> */}
      {/*   <button className="ql-redo"> */}
      {/*     <CustomRedo /> */}
      {/*   </button> */}
      {/* </span> */}
      <span className="ql-formats">
        <button
          // className="ql-save"
          onClick={() => {
            dispatch({ type: RESET });
            dispatch({ type: SUCCESS, payload: 'New document created' });
            setTimeout(() => {
              dispatch({ type: CLEAR_SUCCESS });
            }, TIME_FOR_CLEARING_SETTIMEOUT);
          }}
        >
          <ClearDocument />
        </button>
      </span>
      <span className="ql-formats">
        <button
          // className="ql-save"
          onClick={() => {
            saveToDatabase({
              documentName,
              editorText,
              documentId,
              dispatch,
            });
          }}
        >
          <SaveText />
        </button>
      </span>
    </div>
  );
};

export default QuillToolbar;
