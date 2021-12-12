export function getFetchURL() {
  if (process.env.NODE_ENV === 'production') {
    return 'https://jsramverk-editor-pene14.azurewebsites.net';
  }
  return 'http://localhost:1337';
}
