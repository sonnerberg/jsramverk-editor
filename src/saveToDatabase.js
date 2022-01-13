import { dispatchFlashMessage } from './dispatchFlashMessage';
import {
  ERROR,
  FIELD,
  JOIN_ROOM,
  UPDATE_ALL_DOCUMENTS,
} from './documentReducer';
import { sendGraphQLQuery } from './sendGraphQLQuery';
import { socket } from './socket';

export async function saveToDatabase({
  documentId: id,
  documentName: name,
  editorText: html,
  dispatch,
}) {
  let queryResult;
  try {
    if (!id) {
      queryResult = await (
        await sendGraphQLQuery({
          query: `mutation {
            createDocument(html: "${html}" name: "${name}") {
              _id
              name
              text
            }
      }`,
        })
      ).json();
      dispatch({
        type: FIELD,
        fieldName: 'documentId',
        payload: queryResult.data.createDocument._id,
      });
      dispatch({
        type: UPDATE_ALL_DOCUMENTS,
        payload: { _id: queryResult.data.createDocument._id, name, html },
      });
      socket.emit('join', { room: queryResult.data.createDocument._id });
      dispatch({
        type: JOIN_ROOM,
        payload: queryResult.data.createDocument._id,
      });
      return queryResult;
    } else {
      queryResult = await (
        await sendGraphQLQuery({
          query: `mutation {
            updateDocument(html: "${html}" name: "${name}" id: "${id}") {
              _id
              name
              text
              allowedUsers
            }
        }`,
        })
      ).json();
      dispatch({
        type: FIELD,
        fieldName: 'documentId',
        payload: id,
      });
      dispatch({
        type: UPDATE_ALL_DOCUMENTS,
        payload: { _id: id, name, html },
      });
      return queryResult;
    }
  } catch (error) {
    console.error('catching error', error);
    dispatchFlashMessage({
      dispatch,
      payload: error.message,
      type: ERROR,
    });
  }
}
