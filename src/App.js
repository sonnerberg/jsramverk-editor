import './App.css';
import { useEffect, useReducer } from 'react';
import {
  documentReducer,
  initialDocumentReducerState,
} from './documentReducer';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { TextEditor } from './TextEditor';
import { ErrorMessage } from './ErrorMessage';
import { SuccessMessage } from './SuccessMessage';
import {
  initialUserReducerState,
  LOGIN_USER,
  RESET_USER,
  userReducer,
} from './userReducer';

import { Navigate } from 'react-router-dom';
import { Login } from './Login';
import { Register } from './Register';
import { sendGraphQLQuery } from './sendGraphQLQuery';

function App() {
  const [
    {
      documentId,
      editorText,
      documentName,
      allDocuments,
      success,
      error,
      joinedRooms,
    },
    dispatch,
  ] = useReducer(documentReducer, initialDocumentReducerState);

  const [{ user }, dispatchUser] = useReducer(
    userReducer,
    initialUserReducerState
  );

  useEffect(() => {
    sendGraphQLQuery({
      query: '{ user { email } }',
    })
      .then((result) => result.json())
      .then((result) => {
        dispatchUser({ type: LOGIN_USER, payload: result.data.user });
      });
  }, []);

  return (
    <>
      {error ? <ErrorMessage error={error} /> : null}
      {success ? <SuccessMessage success={success} /> : null}
      <BrowserRouter
        basename={
          process.env.NODE_ENV === 'production' ? '/~pene14/editor' : ''
        }
      >
        <nav
          style={{
            display: 'flex',
            gap: '10%',
            flexWrap: 'wrap',
            marginInlineStart: '10px',
          }}
        >
          {/* TODO: Only link to login if user is not logged in */}
          <Link to="/">Home</Link>
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/register">Register</Link>}
          {user && <Link to="/editor">Editor</Link>}
        </nav>
        {user && (
          <>
            <div>
              Hello {/* {user.emails ? user.emails[0].value : ''} */}
              {user.email ? user.email : ''}
              {/* <img src={user?._json.avatar_url} /> */}
              {/* {user} */}
            </div>
            <button
              onClick={() => {
                sendGraphQLQuery({
                  query: `mutation {
                              logout {
                                redirect
                              }
                            }`,
                }).then(() => {
                  dispatchUser({ type: RESET_USER });
                });
              }}
            >
              Logout
            </button>
          </>
        )}

        <Routes>
          <Route
            path="/editor"
            element={
              user ? (
                <TextEditor
                  error={error}
                  success={success}
                  documentId={documentId}
                  editorText={editorText}
                  documentName={documentName}
                  dispatch={dispatch}
                  joinedRooms={joinedRooms}
                  allDocuments={allDocuments}
                  dispatchUser={dispatchUser}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/register"
            element={
              !user ? (
                <Register dispatch={dispatch} dispatchUser={dispatchUser} />
              ) : (
                <Navigate to="/editor" />
              )
            }
          />
          <Route
            path="/login"
            element={
              !user ? (
                <Login dispatch={dispatch} dispatchUser={dispatchUser} />
              ) : (
                <Navigate to="/editor" />
              )
            }
          />
          <Route path="/" element={<div>Welcome to editor</div>} />
          {/* Route to path * has to be last */}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>

        <div>
          <i>Editor app, 2021</i>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
