import { GithubLogin } from './GithubLogin';
import { LoginForm } from './LoginForm';

export function Login({ dispatch, dispatchUser }) {
  return (
    <>
      <GithubLogin />
      <LoginForm dispatch={dispatch} dispatchUser={dispatchUser} />
    </>
  );
}
