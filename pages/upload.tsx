import { css } from '@emotion/react';
import { useLoadScript } from '@react-google-maps/api';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import Layout from '../components/Layout';
import { getUserByValidSessionToken } from '../util/database';
import { UploadResponseBody } from './api/upload';
import { errorStyles } from './login';

const appNameStyles = css`
  font-family: 'Allura', cursive;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
`;

const uploadContainerStyles = css`
  background: #eff8fc;

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
    margin-left: 0;
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
  margin-left: 8x;
  padding-top: 4px;
  display: flex;
  flex-direction: column;
`;

const uploadTextareaStyles = css`
  width: 500px;
  height: 50px;
  border-radius: 8px;
  border-color: #a8c5f9;
`;

const spotNameStyles = css`
  width: 496px;
  height: 26px;
  border-radius: 8px;
  border-color: #a8c5f9;
`;

const locationInputStyles = css`
  width: 497px;
  height: 30px;
  border-radius: 8px;
  border-color: #a8c5f9;
`;

const tagSelectStyles = css`
  width: 504px;
  height: 30px;
  border-radius: 8px;
  border-color: #a8c5f9;
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
  googleAPI: string;
};
type Errors = { message: string }[];

type Value = string;

export default function Upload(props: Props) {
  const [pictureUrl, setPictureUrl] = useState('/white.png');
  const [spotName, setSpotName] = useState('');
  const [loading, setLoading] = useState(false);
  const [postDescription, setPostDescription] = useState('');
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [postTag, setPostTag] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const libraries = ['places' as const];

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

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: props.googleAPI,
    libraries,
  });

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';
  const handleSelect = async (value: Value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setLocation(value);
    setLat(latLng.lat);
    setLng(latLng.lng);
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
        lat: lat,
        lng: lng,
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
                  css={spotNameStyles}
                  placeholder="add spot name"
                  value={spotName}
                  onChange={(event) => setSpotName(event.currentTarget.value)}
                />
              </label>
              <br />
              <label>
                <textarea
                  css={uploadTextareaStyles}
                  placeholder="add spot description"
                  value={postDescription}
                  onChange={(event) =>
                    setPostDescription(event.currentTarget.value)
                  }
                />
              </label>
              <br />
              <label>
                <PlacesAutocomplete
                  value={location}
                  // countries="at"
                  onChange={setLocation}
                  onSelect={handleSelect}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                    <div>
                      <input
                        css={locationInputStyles}
                        {...getInputProps({ placeholder: 'add spot address' })}
                      />

                      <div>
                        {loading ? <div>...loading</div> : null}

                        {suggestions.map((suggestion) => {
                          const style = {
                            backgroundColor: suggestion.active
                              ? '#a8c5f9'
                              : '#fff',
                            width: '20em',
                            marginTop: 12,
                            marginBottom: 12,
                            paddingTop: 4,
                            paddingBottom: 4,
                            fontFamily: 'Inter',
                            fontWeight: 500,
                            fontSize: 14,
                            color: '#5d6470',
                          };

                          return (
                            <div key={`li-suggestion-${suggestion.placeId}`}>
                              <div
                                {...getSuggestionItemProps(suggestion, {
                                  style,
                                })}
                              >
                                {suggestion.description}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </label>
              <br />
              <div>
                <select
                  name="postTag"
                  id="postTag"
                  placeholder="select spot tags"
                  value={postTag}
                  onChange={(event) => setPostTag(event.currentTarget.value)}
                  css={tagSelectStyles}
                >
                  <option value="choose tag">choose tag</option>
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
                {errors.map((error) => (
                  <div css={errorStyles} key={`error-${error.message}`}>
                    {error.message}
                  </div>
                ))}
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
  const googleAPI = process.env.GOOGLE_API_KEY;

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
      googleAPI: googleAPI,
    },
  };
}
