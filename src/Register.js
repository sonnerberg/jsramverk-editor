import { useState } from 'react';
import { dispatchFlashMessage } from './dispatchFlashMessage';
import { ERROR, SUCCESS } from './documentReducer';
import { sendGraphQLQuery } from './sendGraphQLQuery';
import { LOGIN_USER } from './userReducer';

export function Register({ dispatch, dispatchUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function submitForm(event) {
    event.preventDefault();
    let result;
    try {
      result = await sendGraphQLQuery({
        query: `mutation {
          registerUser(email: "${email}" password: "${password}") {
            message
          }
        }`,
      });
      result = await result.json();
    } catch (error) {
      console.error(error);
    }
    if (result?.data) {
      dispatchFlashMessage({
        dispatch,
        type: SUCCESS,
        payload: 'Successfully registered',
      });
      sendGraphQLQuery({
        query: '{ user { email } }',
      })
        .then((result) => result.json())
        .then((result) => {
          dispatchUser({ type: LOGIN_USER, payload: result.data.user });
        });
    } else if (result?.errors) {
      console.error(result.errors);
      const payload =
        result.errors.message.indexOf('duplicate key error') !== -1
          ? 'Email already registered'
          : `${result.errors.message}`;
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
            Register
          </button>
        </div>
      </form>
    </>
  );
}
