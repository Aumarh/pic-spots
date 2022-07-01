import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getValidSessionByToken } from '../util/database';
import { LoginResponseBody } from './api/login';
import {
  errorStyles,
  passwordInputStyles,
  usernameInputStyles,
} from './register';

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

  background: #d9d9d9;
  mix-blend-mode: screen;
  border: 1px solid #000000;
`;

const createButtonStyles = css`
  /* Button */

  position: absolute;
  left: 17.33%;
  right: 63.56%;
  top: 70.37%;
  bottom: 24.21%;
  width: 200px;
  background: #1bd290;
  /* mix-blend-mode: screen; */
  border-radius: 2px;
  color: #000000;
`;

const loginButtonStyles = css`
  /* Button */

  position: absolute;
  left: 17.33%;
  right: 63.56%;
  top: 52.95%;
  bottom: 41.62%;
  width: 200px;
  background: #1b64d2;
  /* mix-blend-mode: screen; */
  border-radius: 2px;
  color: #000000;
`;

// const lineStyles = css`
//   /* Line 1 */

//   position: absolute;
//   width: 365px;
//   height: 0px;
//   left: 220px;
//   top: 639px;

//   border: 1px solid #000000;
// `;

const createAccountStyles = css`
  color: #000000;
  /* position: absolute; */
  width: 200px;
  height: 18px;
  left: 283px;
  top: 647px;
  font-style: italic;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
`;

type Props = {
  refreshUserProfile: () => Promise<void>;
};

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<
    {
      message: string;
    }[]
  >([]);
  const router = useRouter();

  async function loginHandler() {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const loginResponseBody: LoginResponseBody = await response.json();
    console.log(loginResponseBody);

    if ('errors' in loginResponseBody) {
      setErrors(loginResponseBody.errors);
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
        <title>Login</title>
        <meta name="login" content="Login a new user" />
      </Head>
      <main>
        <h1>Login</h1>
        <div css={heroStyle}>
          <div css={loginBannerStyles}>
            <div>
              <label>
                username:{' '}
                <input
                  placeholder="username"
                  css={usernameInputStyles}
                  value={username}
                  onChange={(event) => {
                    setUsername(event.currentTarget.value);
                  }}
                />
              </label>
              <label>
                password:{' '}
                <input
                  type="password"
                  placeholder="password"
                  css={passwordInputStyles}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.currentTarget.value);
                  }}
                />
              </label>
              <button css={loginButtonStyles} onClick={() => loginHandler()}>
                Login
              </button>
              {errors.map((error) => (
                <div css={errorStyles} key={`error-${error.message}`}>
                  {error.message}
                </div>
              ))}
            </div>
            <p css={createAccountStyles}>Don't have an account yet?</p>
            <div>
              <Link href="/register">
                <a>
                  <button css={createButtonStyles}>Create new account</button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Redirect from HTTP to HTTPS on Heroku
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/login`,
        permanent: true,
      },
    };
  }

  // 1. check if there is a token and if it is valid from the cookie
  const token = context.req.cookies.sessionToken;

  if (token) {
    // 2. check if the token is valid and redirect
    const session = await getValidSessionByToken(token);

    if (session) {
      console.log(session);
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  }

  // 3. Otherwise, generate CSRF token and render the page

  return {
    props: {},
  };
}
