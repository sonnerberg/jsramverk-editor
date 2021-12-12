import { useState } from 'react';
import { dispatchFlashMessage } from './dispatchFlashMessage';
import { ERROR, SUCCESS } from './documentReducer';
import { LOGIN_USER } from './userReducer';
import { getFetchURL } from './utils/getFetchURL';

export function LoginForm({ dispatch, dispatchUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function submitForm(event) {
    event.preventDefault();
    let requestOptions = {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    };
    let result;
    try {
      result = await fetch(`${getFetchURL()}/users/v1/login`, requestOptions);
      result = await result.json();
    } catch (error) {
      console.error(error);
    }
    if (result?.data) {
      dispatchFlashMessage({
        dispatch,
        type: SUCCESS,
        payload: 'Successfully logged in',
      });
      // TODO: Add user to user variable
      fetch(`${getFetchURL()}/auth/v1/user`, { credentials: 'include' })
        .then((res) => res.json())
        .then((result) =>
          dispatchUser({ type: LOGIN_USER, payload: result.data })
        );
    } else if (result?.errors?.message) {
      console.error(result.errors);
      const payload = `${result.errors.message}`;
      dispatchFlashMessage({
        dispatch,
        type: ERROR,
        payload,
      });
    } else {
      dispatchFlashMessage({
        dispatch,
        type: ERROR,
        payload: 'Cannot connect to server',
      });
    }
  }
  return (
    <>
      <form
        onSubmit={submitForm}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div>
          <label
            htmlFor="emailInput"
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingInline: '10px',
            }}
          >
            Email
            <input
              value={email}
              id="emailInput"
              required
              type="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </label>
          <label
            htmlFor="passwordInput"
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingInline: '10px',
            }}
          >
            Password
            <input
              value={password}
              id="passwordInput"
              minLength={5}
              required
              type={showPassword ? 'text' : 'password'}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </label>
        </div>
        <div
          style={{
            paddingInline: '10px',
          }}
        >
          <label htmlFor="showPassword">
            Show password
            <input
              type={'checkbox'}
              id="showPassword"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
          </label>
          <button style={{ display: 'block' }} type="submit">
            Login
          </button>
        </div>
      </form>
    </>
  );
}
