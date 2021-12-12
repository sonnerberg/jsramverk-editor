export const TIME_FOR_CLEARING_SETTIMEOUT = 3500;

export const RESET = 'RESET';
export const FIELD = 'FIELD';
export const EDIT = 'EDIT';
export const SUCCESS = 'SUCCESS';
export const ERROR = 'ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const CLEAR_SUCCESS = 'CLEAR_SUCCESS';
export const UPDATE_ALL_DOCUMENTS = 'UPDATE_ALL_DOCUMENTS';
export const JOIN_ROOM = 'JOIN_ROOM';
export const LEAVE_ROOM = 'LEAVE_ROOM';

// TODO: Move success and error to flashMessageReducer

export const initialDocumentReducerState = {
  documentId: null,
  editorText: '',
  documentName: '',
  allDocuments: [],
  success: '',
  error: '',
  joinedRooms: [],
};

export function documentReducer(state, action) {
  switch (action.type) {
    case JOIN_ROOM:
      return {
        ...state,
        joinedRooms: [...state.joinedRooms, action.payload],
      };
    case LEAVE_ROOM:
      const joinedRooms = [...state.joinedRooms].filter(
        (room) => room !== action.payload
      );
      return {
        ...state,
        joinedRooms,
      };
    case FIELD:
      return {
        ...state,
        [action.fieldName]: action.payload,
      };
    case UPDATE_ALL_DOCUMENTS:
      // check if id exists in allDocuments
      const documentExists = state.allDocuments
        .map((doc) => doc._id)
        .includes(action.payload._id);
      if (!documentExists) {
        // TODO: Emit document to connected sockets
        return {
          ...state,
          allDocuments: [...state.allDocuments, action.payload],
        };
      } else {
        // Find the object with the id and set html and name
        const indexOfDocument = state.allDocuments.findIndex(
          (doc) => doc._id === action.payload._id
        );
        // Create a copy of allDocuments
        const allDocuments = [...state.allDocuments];
        allDocuments[indexOfDocument] = action.payload;
        return {
          ...state,
          allDocuments,
        };
      }
    case CLEAR_SUCCESS:
      return {
        ...state,
        success: '',
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: '',
      };
    case ERROR:
      return {
        ...state,
        error:
          action.payload === 'Document failed validation'
            ? 'Both name and content needed'
            : action.payload,
        success: '',
      };
    case SUCCESS:
      return {
        ...state,
        success: action.payload,
        error: '',
      };
    case EDIT:
      return {
        ...state,
        documentId: action.payload.id,
        editorText: action.payload.html,
        documentName: action.payload.name,
      };
    case RESET:
      return {
        ...state,
        documentId: '',
        editorText: '',
        documentName: '',
        success: '',
      };
    default:
      return state;
  }
}
