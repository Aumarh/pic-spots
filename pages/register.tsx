import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { createCsrfToken } from '../util/auth';
import { getValidSessionByToken } from '../util/database';
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
type Errors = { message: string }[];

type Props = {
  refreshUserProfile: () => Promise<void>;
  csrfToken: string;
  cloudinaryAPI: string;
};
export default function Register(props: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [heroImage, setHeroImage] = useState('/heroImage1.png');
  const [errors, setErrors] = useState<Errors>([]);
  const router = useRouter();
  console.log('this is cloudinary', props.cloudinaryAPI);

  const uploadImage = async (event: any) => {
    const files = event.currentTarget.files;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('upload_preset', 'uploads');
    // setLoading(true);

    const response = await fetch(
      `	https://api.cloudinary.com/v1_1/cscorner/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );
    const file = await response.json();

    setHeroImage(file.secure_url);
    console.log('picture from register', file.secure_url);
    // setLoading(false);
  };

  async function registerHandler() {
    // event.preventDefault();
    const registerResponse = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        bio: bio,
        heroImage: heroImage,
        csrfToken: props.csrfToken,
      }),
    });
    const registerResponseBody: RegisterResponseBody =
      await registerResponse.json();
    console.log('This is register response', registerResponseBody);

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
              <div>
                First name:
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.currentTarget.value)}
                  placeholder="first_name"
                  css={firstNameInputStyles}
                />
              </div>
              <br />
              <div>
                Last name:
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.currentTarget.value)}
                  placeholder="last_name"
                  css={lastNameInputStyles}
                />
              </div>
              <br />
              <div>
                User name:
                <input
                  value={username}
                  onChange={(event) => setUsername(event.currentTarget.value)}
                  placeholder="username"
                  css={usernameInputStyles}
                />
              </div>
              <br />
              <div>
                Password:
                <input
                  type="password"
                  onChange={(event) => setPassword(event.currentTarget.value)}
                  value={password}
                  placeholder="password"
                  css={passwordInputStyles}
                />
              </div>
              <br />
              <div>
                Bio:
                <textarea
                  value={bio}
                  placeholder="add a short bio"
                  onChange={(event) => setBio(event.currentTarget.value)}
                />
              </div>
              <br />
              <div>
                <input
                  type="file"
                  onChange={async (event) => {
                    await uploadImage(event);
                  }}
                />
              </div>
              <br />
              <div>
                <img
                  src={heroImage}
                  alt="user hero pic"
                  style={{ height: '100px', width: '100px' }}
                />
              </div>
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

export function getServerSideProps(context: GetServerSidePropsContext) {
  // Redirect from HTTP to HTTPS on Heroku
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/register`,
        permanent: true,
      },
    };
  }

  // 1. check if there is a token and if it is valid from the cookie
  // const token = context.req.cookies.sessionToken;

  // if (token) {
  //   // 2. check if the token is valid and redirect
  //   const session = await getValidSessionByToken(token);

  //   if (session) {
  //     console.log(session);
  //     return {
  //       redirect: {
  //         destination: '/',
  //         permanent: false,
  //       },
  //     };
  //   }
  // }

  const cloudinaryAPI = process.env.CLOUDINARY_NAME;
  // 3. Otherwise, generate CSRF token and render the page

  return {
    props: {
      // csrfToken: createCsrfToken(),
      cloudinaryAPI,
    },
  };
}
