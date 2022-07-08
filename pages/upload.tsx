import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import { getUserByValidSessionToken } from '../util/database';
import { UploadResponseBody } from './api/upload';

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

        <div>
          <h1>Upload new spots</h1>
        </div>

        <div>
          <div>
            <label>
              <input
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
            <div>
              <label>
                <input
                  placeholder="add title"
                  value={spotName}
                  onChange={(event) => setSpotName(event.currentTarget.value)}
                />
              </label>
              <br />
              <label>
                <textarea
                  placeholder="add description"
                  value={postDescription}
                  onChange={(event) =>
                    setPostDescription(event.currentTarget.value)
                  }
                />
              </label>
              <br />
              <label>
                <input
                  placeholder="location"
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
                <button onClick={() => uploadHandler()}>Upload</button>
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
