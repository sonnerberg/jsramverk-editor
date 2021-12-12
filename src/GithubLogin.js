import { getFetchURL } from './utils/getFetchURL';
import octocat from './images/Octocat.png';

export function GithubLogin() {
  return (
    <a
      href={`${getFetchURL()}/auth/v1/github`}
      style={{ height: '70px', display: 'block' }}
    >
      <img src={octocat} alt="Octocat" style={{ height: '70px' }} />
      Login with Github
    </a>
  );
}
