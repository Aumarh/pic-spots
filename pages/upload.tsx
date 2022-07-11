import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import { getUserByValidSessionToken } from '../util/database';
import { UploadResponseBody } from './api/upload';

const appNameStyles = css`
  font-family: 'Allura', cursive;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
`;

const uploadContainerStyles = css`
  background: #f4effc;

  border-radius: 4px;
  display: flex;
  justify-content: center;
`;

const uploadBodyStyles = css`
  form {
    display: flex;
    gap: 300px;
  }
`;

const uploadInputStyles = css`
  margin-bottom: 30px;

  ::-webkit-file-upload-button {
    background: #a8c5f9;
    color: black;
    margin-left: 8x;
    padding-top: 4px;
    font-size: 18px;
    border-radius: 4px;
    width: 150px;
    height: 40px;
    outline: none;
    cursor: pointer;
    border: transparent;
    /* display: none; */
  }

  /* :hover::before {
    border: #779677 solid 4px;
  } */
`;

const uploadInfoStyles = css`
  /* border: solid 10px #957666; */
  /* border-radius: 66px; */
  /* width: 20px; */
  /* height: 600px; */
  /* margin: 50px; */
  margin-left: 8x;
  padding-top: 4px;
  /* box-shadow: 5px 10px 20px #957666; */
  /* align-items: center; */
  display: flex;
  flex-direction: column;
`;

const uploadButtonStyles = css`
  color: black;
  background: #a8c5f9;
  text-align: center;
  width: 150px;
  height: 40px;
  border-radius: 4px;
  margin-top: 30px;
  font-size: 18px;

  border: transparent;
  cursor: pointer;
`;

type Props = {
  refreshUserProfile: () => void;
  userObject: { username: string };
  // cloudinaryAPI: string;
  userId: number;
  username: string;
};
type Errors = { message: string }[];

export default function Upload(props: Props) {
  const [pictureUrl, setPictureUrl] = useState('/white.png');
  const [spotName, setSpotName] = useState('');
  const [loading, setLoading] = useState(false);
  const [postDescription, setPostDescription] = useState('');
  const [location, setLocation] = useState('');
  const [postTag, setPostTag] = useState('');
  const [errors, setErrors] = useState<Errors>([]);

  const router = useRouter();

  const uploadImage = async (event: any) => {
    const files = event.currentTarget.files;
    console.log(files);
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('upload_preset', 'uploads');
    setLoading(true);

    const response = await fetch(
      `	https://api.cloudinary.com/v1_1/cscorner/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );
    const file = await response.json();

    setPictureUrl(file.secure_url);
    console.log(file.secure_url);
    setLoading(false);
  };

  async function uploadHandler() {
    // event.preventDefault();
    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: props.userId,
        pictureUrl: pictureUrl,
        spotName: spotName,
        postDescription: postDescription,
        location: location,
        // postTag: postTag,
        username: props.username,
      }),
    });

    const uploadResponseBody =
      (await uploadResponse.json()) as UploadResponseBody;

    console.log('uploadResponseBody', uploadResponseBody);

    // handling the errors from the server with an error message
    if ('errors' in uploadResponseBody) {
      setErrors(uploadResponseBody.errors);
      return;
    }

    props.refreshUserProfile();
    // redirect to user profile after upload
    await router.push(`/users/private-profile`);
  }

  return (
    <div>
      <Layout userObject={props.userObject}>
        <Head>
          <title>Upload</title>

          <meta name="Pic_spots" content="Pic_spots" />
        </Head>

        <div css={appNameStyles}>
          <h1>Upload new spots</h1>
        </div>

        <div css={uploadContainerStyles}>
          <div css={uploadBodyStyles}>
            <label>
              <input
                css={uploadInputStyles}
                type="file"
                onChange={async (event) => {
                  await uploadImage(event);
                }}
              />

              <div>
                {loading ? (
                  <div>
                    <img src="/loading.gif" alt="loading" />
                  </div>
                ) : (
                  <img
                    src={pictureUrl}
                    alt="preview"
                    style={{ height: '500px', width: '500px' }}
                  />
                )}
              </div>
            </label>
            <br />
            <div css={uploadInfoStyles}>
              <label>
                <input
                  placeholder="spot name"
                  value={spotName}
                  onChange={(event) => setSpotName(event.currentTarget.value)}
                />
              </label>
              <br />
              <label>
                <textarea
                  placeholder="spot description"
                  value={postDescription}
                  onChange={(event) =>
                    setPostDescription(event.currentTarget.value)
                  }
                />
              </label>
              <br />
              <label>
                <input
                  placeholder=" spot location"
                  value={location}
                  onChange={(event) => setLocation(event.currentTarget.value)}
                />
              </label>
              <br />
              <div>
                <select
                  name="postTag"
                  id="postTag"
                  placeholder="select spot tags"
                  value={postTag}
                  onChange={(event) => setPostTag(event.currentTarget.value)}
                >
                  <option value="outdoor">outdoor</option>
                  <option value="indoor">indoor</option>
                  <option value="daytime">daytime</option>
                  <option value="nighttime">nighttime</option>
                  <option value="mountain">mountain</option>
                  <option value="forest">forest</option>
                </select>
              </div>

              <br />
              <div>
                <button
                  css={uploadButtonStyles}
                  onClick={() => uploadHandler()}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cloudinaryAPI = process.env.CLOUDINARY_NAME;
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getUserByValidSessionToken(sessionToken);

  if (!session) {
    return {
      props: {
        error: 'You need to be logged in!',
      },
    };
  }
  return {
    props: {
      cloudinaryAPI,
      userId: session.id,
      username: session.username,
    },
  };
}
