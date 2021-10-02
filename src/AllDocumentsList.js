import { useEffect, useState } from 'react';

export function AllDocumentsList({
  setDocumentId,
  setEditorText,
  setDocumentName,
}) {
  const [allDocuments, setAllDocuments] = useState([]);
  useEffect(() => {
    fetch('http://localhost:1337/api/v1/')
      .then((response) => response.json())
      .then((result) =>
        result.data
          ? setAllDocuments(result.data)
          : console.error(result.errors.message)
      );
  }, []);

  function handleClick(event, id, name, html) {
    setDocumentId(id);
    setDocumentName(name);
    setEditorText(html);
  }

  return (
    <div>
      {allDocuments.map(({ _id: id, name, html }) => (
        <div
          key={id}
          // onClick={handleClick}
          onClick={(event) => {
            handleClick(event, id, name, html);
          }}
        >
          {name}
        </div>
      ))}
    </div>
  );
}
