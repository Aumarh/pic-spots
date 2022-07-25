import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RegisterResponseBody } from './api/register';

const heroStyle = css`
  background: url('https://i.imgur.com/ZcpJB6i.jpg');
  /* background-color: red; */
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
  height: 726px;
  left: 207px;
  top: 35px;
  font-family: inter;
  /* mix-blend-mode: screen; */
  background: #d9d9d9;
  mix-blend-mode: screen;
  border: 1px solid #000000;
  > div {
    margin-left: 55px;
    margin-top: 50px;
  }
`;

const headingStyles = css`
  position: absolute;
  color: #000000;
  margin-top: 26px;
  left: 300px;
  z-index: 1;
  text-align: center;
  h1 {
    text-shadow: 1px 1px 1px #36cff2;
  }
`;

export const usernameInputStyles = css`
  top: 35.74%;
  bottom: 58.83%;
  width: 191px;
  height: 30px;
  border-color: #16231f;
  border-radius: 8px;
  color: #000000;
`;

export const passwordInputStyles = css`
  width: 191px;
  height: 30px;
  left: 17.33%;
  right: 63.56%;
  top: 44.7%;
  bottom: 49.87%;
  color: #000000;
  border-color: #16231f;
  border-radius: 8px;
`;

const createAccountButtonStyles = css`
  background-image: linear-gradient(144deg, #af40ff, #5c849f 50%, #1bd290);
  border: 0;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  box-sizing: border-box;
  height: 40px;
  left: 17.33%;
  right: 63.56%;
  top: 70.37%;
  bottom: 24.21%;
  width: 199px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  cursor: pointer;

  /* background: #1bd290; */
  color: #000000;
  margin-top: 20px;
  border-radius: 8px;
  font-size: 20px;

  :hover {
    background-color: #1bd290;
    box-shadow: #4e10ab 0 -6px 8px inset;
    transform: scale(1.125);
  }

  /* @media (min-width: 768px) {

  .button-63 {
    font-size: 24px;
    min-width: 196px;
  } */
`;

const firstNameInputStyles = css`
  /* position: absolute; */
  left: 15.61%;
  right: 65.28%;
  top: 35.85%;
  bottom: 58.73%;
  width: 190px;
  height: 30px;
  border-color: #16231f;
  border-radius: 8px;
`;

const lastNameInputStyles = css`
  /* position: absolute; */
  left: 15.61%;
  right: 65.28%;
  top: 42.64%;
  bottom: 51.93%;
  width: 190px;
  height: 30px;
  border-color: #16231f;
  border-radius: 8px;
`;

const bioInputStyles = css`
  top: 35.85%;
  bottom: 58.73%;
  width: 190px;
  border-color: #16231f;
  border-radius: 8px;
`;

const fileButtonStyles = css`
  border-radius: 8px;
  margin-bottom: 2px;

  ::-webkit-file-upload-button {
    background: #1bd290;
    color: black;
    margin-left: 0;
    padding-top: 4px;
    font-size: 18px;
    border-radius: 4px;
    width: 120px;
    height: 30px;
    outline: none;
    cursor: pointer;
    border: transparent;
    /* display: none; */
  }
`;

const uploadImageStyles = css`
  margin-left: 55px;

  img {
    border-radius: 10px;
    margin-top: 0;
  }
`;

const textAreaStyles = css`
  width: 190px;
  border-radius: 4px;
  height: 50px;
  border-color: #16231f;
  border-radius: 8px;
  font-family: inherit;
  font-size: inherit;
`;

export const errorStyles = css`
  color: red;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
  margin-right: 44px;
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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div css={heroStyle}>
          <div css={headingStyles}>
            <h1>Register</h1>
          </div>
          <div css={loginBannerStyles}>
            <div>
              <div>
                First name:
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.currentTarget.value)}
                  placeholder="add first name"
                  css={firstNameInputStyles}
                />
              </div>
              <br />
              <div>
                Last name:
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.currentTarget.value)}
                  placeholder="add last name"
                  css={lastNameInputStyles}
                />
              </div>
              <br />
              <div>
                Username:
                <input
                  value={username}
                  onChange={(event) => setUsername(event.currentTarget.value)}
                  placeholder="add username"
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
                  placeholder="add password"
                  css={passwordInputStyles}
                />
              </div>
              <br />
              <div css={bioInputStyles}>
                Bio:
                <textarea
                  value={bio}
                  placeholder="add a short bio"
                  onChange={(event) => setBio(event.currentTarget.value)}
                  css={textAreaStyles}
                />
              </div>
              <br />
              <div>
                <input
                  css={fileButtonStyles}
                  type="file"
                  onChange={async (event) => {
                    await uploadImage(event);
                  }}
                />
              </div>
              <br />
              <div css={uploadImageStyles}>
                <img
                  src={heroImage}
                  alt="user hero pic"
                  style={{ height: '100px', width: '100px' }}
                />
              </div>
              <div>
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
