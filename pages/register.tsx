import { css } from '@emotion/react';
import { useState } from 'react';

const heroStyle = css`
  background: url('heroimage.jpeg');
  position: absolute;
  width: 1512px;
  height: 982px;
  left: 0px;
  top: 0px;

  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
`;

const loginBannerStyles = css`
  box-sizing: border-box;
  border-radius: 2px;
  position: absolute;
  width: 320px;
  height: 500px;
  left: 207px;
  top: 190px;
  /* mix-blend-mode: screen; */
  background: #d9d9d9;
  mix-blend-mode: screen;
  border: 1px solid #000000;

  > div {
    margin-left: 55px;
    margin-top: 50px;
  }
`;
const usernameInputStyles = css`
  /* position: absolute; */
  left: 17.33%;
  right: 63.56%;
  top: 35.74%;
  bottom: 58.83%;
  width: 191px;
  background: #ffffff;
  border-radius: 2px;
  color: #000000;
`;

const passwordInputStyles = css`
  width: 191px;
  /* position: absolute; */
  left: 17.33%;
  right: 63.56%;
  top: 44.7%;
  bottom: 49.87%;
  color: #000000;
  background: #ffffff;
  border-radius: 2px;
`;

const createAccountButtonStyles = css`
  /* Button */

  /* position: absolute; */
  left: 17.33%;
  right: 63.56%;
  top: 70.37%;
  bottom: 24.21%;
  width: 199px;
  background: #1bd290;

  border-radius: 2px;
  color: #000000;
`;

const firstNameInputStyles = css`
  /* position: absolute; */
  left: 15.61%;
  right: 65.28%;
  top: 35.85%;
  bottom: 58.73%;
  width: 190px;
  background: #ffffff;
  border-radius: 2px;
`;

const lastNameInputStyles = css`
  /* position: absolute; */
  left: 15.61%;
  right: 65.28%;
  top: 42.64%;
  bottom: 51.93%;
  width: 190px;
  background: #ffffff;
  border-radius: 2px;
`;

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function registerHandler() {
    // event.preventDefault();
    const registerResponse = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: password,
      }),
    });
    const registerResponseBody = await registerResponse.json();
    console.log(registerResponseBody);
  }
  return (
    <div css={heroStyle}>
      <div css={loginBannerStyles}>
        <div>
          <label>
            First name:
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.currentTarget.value)}
              placeholder="first_name"
              css={firstNameInputStyles}
            />
          </label>
          <br />
          <label>
            Last name:
            <input
              value={lastName}
              onChange={(event) => setLastName(event.currentTarget.value)}
              placeholder="last_name"
              css={lastNameInputStyles}
            />
          </label>
          <br />
          <label>
            User name:
            <input
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
              placeholder="username"
              css={usernameInputStyles}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              onChange={(event) => setPassword(event.currentTarget.value)}
              value={password}
              placeholder="password"
              css={passwordInputStyles}
            />
          </label>
          <button
            onClick={() => registerHandler}
            css={createAccountButtonStyles}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
