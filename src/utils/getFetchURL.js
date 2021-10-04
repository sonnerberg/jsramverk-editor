export function getFetchURL() {
  if (process.env.NODE_ENV === 'production') {
    return 'https://jsramverk-editor-pene14.azurewebsites.net/api/v1';
  }
  return 'http://localhost:1337/api/v1';
}
