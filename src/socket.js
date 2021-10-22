import socketIOClient from 'socket.io-client';

const ENDPOINT = process.env.NODE_ENV === 'production' ? 'https://jsramverk-editor-pene14.azurewebsites.net/' :  'http://127.0.0.1:1337';

export const socket = socketIOClient(ENDPOINT);
