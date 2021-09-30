import logo from "./logo.svg";
import "./App.css";
import Editor from "./Editor.js";
import { useEffect, useState } from "react";

function AllDocumentsList() {
  const [allDocuments, setAllDocuments] = useState([]);
  useEffect(() => {
    fetch("http://localhost:1337/api/v1/")
      .then((response) => response.json())
      .then((result) => setAllDocuments(result.data));
  }, []);

  function handleClick(event, name) {
    event.preventDefault();
    console.log(event.target.innerText, name);
  }

  return (
    <div>
      {allDocuments.map(({ _id: id, name, html }) => (
        <div
          key={id}
          // onClick={handleClick}
          onClick={(event) => {
            handleClick(event, html);
          }}
        >
          {name}
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <>
      <AllDocumentsList />
      <Editor />
    </>
  );
}

export default App;
