import { css } from '@emotion/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RegisterResponseBody } from './api/register';

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
export const usernameInputStyles = css`
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

export const passwordInputStyles = css`
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

export const errorStyles = css`
  color: red;
`;

type Props = {
  refreshUserProfile: () => Promise<void>;
};
export default function Register(props: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<
    {
      message: string;
    }[]
  >([]);
  const router = useRouter();

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
    const registerResponseBody: RegisterResponseBody =
      await registerResponse.json();
    console.log(registerResponseBody);

    // handling the errors from the server with an error message
    if ('errors' in registerResponseBody) {
      setErrors(registerResponseBody.errors);
      return;
    }

    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      // Security: Validate returnTo parameter against valid path
      // (because this is untrusted user input)
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)

      // returnTo
    ) {
      await props.refreshUserProfile();
      await router.push(returnTo);
    } else {
      // redirect to /profile

      // await router.push(`/users/${loginResponseBody.user.id}`);
      await props.refreshUserProfile();
      await router.push('/');
    }
  }
  return (
    <div>
      <Head>
        <title>Register</title>
        <meta name="register" content="Register a new user" />
      </Head>
      <main>
        <h1>register</h1>
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
                onClick={() => registerHandler()}
                css={createAccountButtonStyles}
              >
                Create account
              </button>
              {errors.map((error) => (
                <div css={errorStyles} key={`error-${error.message}`}>
                  {error.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
