import React, { useEffect, useState } from 'react';
import { getFetchURL } from './utils/getFetchURL';
import { socket } from './socket';

export const ShareButton = ({ documentId }) => {
  const [showShare, setShowShare] = useState(false);
  const [usersList, setUsersList] = useState([]);

  let fetchURL = `${getFetchURL()}/users/v1`;
  let fetchURLAllowEdit = `${getFetchURL()}/users/v1/allowEdit`;
  useEffect(() => {
    fetch(fetchURL, { credentials: 'include' })
      .then((result) => result.json())
      .then((result) => setUsersList(result.data));
  }, [fetchURL]);
  return (
    <>
      <button
        onClick={() => {
          setShowShare(!showShare);
        }}
      >
        Share
      </button>
      {showShare ? (
        documentId ? (
          <div>
            {usersList.map((user) => {
              return (
                <p key={user._id}>
                  <button
                    onClick={() => {
                      let requestOptions = {
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({
                          documentToEditId: documentId,
                          userWhoShouldEditId: user._id,
                        }),
                      };
                      fetch(fetchURLAllowEdit, requestOptions)
                        .then((result) => result.json())
                        .then(() => {
                          socket.emit('newDocument', {
                            id: documentId,
                          });
                        });
                    }}
                  >
                    share with {user.email}
                  </button>
                </p>
              );
            })}
          </div>
        ) : (
          <div>cannot share unsaved document</div>
        )
      ) : null}
    </>
  );
};
