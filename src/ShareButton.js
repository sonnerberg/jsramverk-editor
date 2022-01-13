import React, { useEffect, useState } from 'react';
import { socket } from './socket';
import { sendGraphQLQuery } from './sendGraphQLQuery';

export const ShareButton = ({ documentId }) => {
  const [showShare, setShowShare] = useState(false);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    sendGraphQLQuery({
      query: `
        {users {email _id}}
      `,
    })
      .then((result) => result.json())
      .then((result) => setUsersList(result.data.users));
  }, []);
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
                      sendGraphQLQuery({
                        query: `
                        mutation {
                          allowEdit(documentToEditId: "${documentId}" userWhoShouldEditId: "${user._id}") {
                            _id
                            name
                            text
                            allowedUsers
                          }
                        }`,
                      })
                        .then((result) => result.json())
                        .then((_result) => {
                          socket.emit('newDocument', {
                            id: documentId,
                            // id: result.data.allowEdit._id,
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
