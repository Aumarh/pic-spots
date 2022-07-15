import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getValidSessionByToken } from '../util/database';
import { LoginResponseBody } from './api/login';

const heroStyle = css`
  background: url('heroimage.jpeg');
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0px;
  top: 0px;

  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
`;

const loginBannerStyles = css`
  box-sizing: border-box;
  border-radius: 8px;
  position: absolute;
  width: 320px;
  height: 500px;
  left: 207px;
  top: 190px;

  background: #d9d9d9;
  mix-blend-mode: screen;
  border: 1px solid #000000;
`;

const usernameInputStyles = css`
  margin-top: 130px;
  margin-left: 55px;
  left: 17.33%;
  right: 63.56%;
  top: 35.74%;
  bottom: 58.83%;
  width: 191px;
  height: 30px;
  border-color: #16231f;
  border-radius: 8px;
  color: #000000;
`;

const passwordInputStyles = css`
  width: 191px;
  height: 30px;
  margin-top: 20px;
  margin-left: 55px;
  left: 15.61%;
  right: 63.56%;
  top: 44.7%;
  bottom: 49.87%;
  color: #000000;
  border-color: #16231f;
  border-radius: 8px;
`;

const createButtonStyles = css`
  background-image: linear-gradient(144deg, #af40ff, #5c849f 50%, #1bd290);
  border: 0;
  box-shadow: rgba(30, 28, 31, 0.2) 0 15px 30px -5px;
  box-sizing: border-box;
  position: absolute;
  left: 17.33%;
  right: 63.56%;
  top: 82.37%;
  /* margin-top: 60px; */
  bottom: 24.21%;
  width: 200px;
  height: 40px;
  /* background: #1bd290; */
  border-radius: 4px;
  color: #000000;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 8px;
  font-size: 18px;

  :hover {
    background-color: #1bd290;
    box-shadow: #163923 0 -6px 8px inset;
    transform: scale(1.125);
  }
`;

const loginButtonStyles = css`
  position: absolute;
  left: 17.33%;
  right: 63.56%;
  top: 55.95%;
  bottom: 41.62%;
  width: 200px;

  background-image: linear-gradient(144deg, #af40ff, #5049b5 50%, #1b64d2);
  border: 0;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  box-sizing: border-box;
  height: 40px;
  /* background: #1b64d2; */
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 8px;
  color: #000000;
  font-size: 20px;

  :hover {
    background-color: #121b28;
    box-shadow: #4e10ab 0 -6px 8px inset;
    transform: scale(1.125);
  }
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

const createAccountTextStyles = css`
  color: #000000;
  margin-left: 55px;
  margin-top: 140px;
  width: 200px;
  height: 18px;
  left: 283px;
  top: 647px;
  font-style: italic;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
`;

export const errorStyles = css`
  color: red;
  margin-top: 10px;
  margin-left: 45px;
  font-weight: bold;
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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Login</h1>
        <div css={heroStyle}>
          <div css={loginBannerStyles}>
            <div>
              <div>
                {/* Username: */}
                <input
                  placeholder="username"
                  css={usernameInputStyles}
                  value={username}
                  onChange={(event) => {
                    setUsername(event.currentTarget.value);
                  }}
                />
              </div>
              <div>
                {/* Password: */}
                <input
                  type="password"
                  onChange={(event) => {
                    setPassword(event.currentTarget.value);
                  }}
                  value={password}
                  placeholder="password"
                  css={passwordInputStyles}
                />
              </div>
              <button css={loginButtonStyles} onClick={() => loginHandler()}>
                Sign In
              </button>
              {errors.map((error) => (
                <div css={errorStyles} key={`error-${error.message}`}>
                  {error.message}
                </div>
              ))}
            </div>
            <p css={createAccountTextStyles}>Don't have an account yet?</p>
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
