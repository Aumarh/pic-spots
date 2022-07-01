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
  cloudinaryAPI: string;
  userId: number;
  username: string;
};

export default function Upload(props: Props) {
  const [pictureUrl, setPictureUrl] = useState('/white.png');
  const [spotName, setSpotName] = useState('');
  const [loading, setLoading] = useState(false);
  const [spotDescription, setSpotDescription] = useState('');
  const [location, setLocation] = useState('');
  const [postTag, setPostTag] = useState('');

  const router = useRouter();

  const uploadImage = async (event: any) => {
    const files = event.currentTarget.files;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('upload_preset', 'uploads');
    setLoading(true);

    const response = await fetch(
      `	https://api.cloudinary.com/v1_1/${props.cloudinaryAPI}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );
    const file = await response.json();

    setPictureUrl(file.secure_url);
    setLoading(false);
  };

  return (
    <div>
      <Layout userObject={props.userObject}>
        <Head>
          <title>Upload</title>

          <meta name="Homepage" content="Homepage" />
        </Head>

        <div>
          <h1>Upload new spots</h1>
        </div>

        <div>
          <div>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                const uploadResponse = await fetch('/api/upload', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userId: props.userId,
                    pictureUrl: pictureUrl,
                    spotName: spotName,
                    spotDescription: spotDescription,
                    location: location,
                    postTag: postTag,
                    username: props.username,
                  }),
                });

                const uploadResponseBody =
                  (await uploadResponse.json()) as UploadResponseBody;

                console.log('uploadResponseBody', uploadResponseBody);

                props.refreshUserProfile();
                // redirect to user profile after upload
                await router.push(`/users/private-profile`);
              }}
            >
              <div>
                <input type="file" onChange={uploadImage} />

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
              </div>

              <div>
                <div>
                  <input
                    placeholder="add title"
                    value={spotName}
                    onChange={(event) => setSpotName(event.currentTarget.value)}
                  />
                </div>
                <div>
                  <textarea
                    placeholder="add description"
                    value={spotDescription}
                    onChange={(event) =>
                      setSpotDescription(event.currentTarget.value)
                    }
                  />
                </div>
                <div>
                  <input
                    placeholder="location"
                    value={location}
                    onChange={(event) => setLocation(event.currentTarget.value)}
                  />
                </div>
                <div>
                  <input
                    placeholder="add spot tags"
                    value={postTag}
                    onChange={(event) => setPostTag(event.currentTarget.value)}
                  />
                </div>
                <div>
                  <button>Upload</button>
                </div>
              </div>
            </form>
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
