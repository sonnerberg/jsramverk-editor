import { getFetchURL } from './utils/getFetchURL';

export function sendGraphQLQuery(query) {
  return fetch(`${getFetchURL()}/graphql`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(query),
  });
}
