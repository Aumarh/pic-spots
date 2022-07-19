import { css } from '@emotion/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import {
  getPostsByUserId,
  getUserByValidSessionToken,
  Post,
  User,
} from '../../util/database';

const appNameStyles = css`
  font-family: 'Allura', cursive;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: left;
  display: flex;
`;

const arrowStyles = css`
  margin-right: 10px;
  margin-bottom: 15px;
  margin-top: 15px;
  :hover {
    cursor: pointer;
  }
`;

const profileInfoStyles = css`
  position: relative;

  border-radius: 8px;
  width: 543px;
  height: 100px;
  /* margin-top: -50px; */
  margin: 10px 0;
  padding: 10px 20px 80px 30px;
  box-shadow: 2px 5px 6px #3b3b3b;
  align-items: right;
  display: flex;
  flex-direction: column;
`;

const heroImageStyles = css`
  img {
    border-radius: 8px;
  }
`;

type Props = {
  refreshUserProfile: () => void;
  user: User;
  userObject: { username: string };
  posts: Post[];
};

export default function PrivateProfile(props: Props) {
  // const router = useRouter();
  // const [postList, setPostList] = useState<Post[]>([]);
  const router = useRouter();

  async function deletePostByPostId(id: number) {
    const deleteResponse = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: id,
      }),
    });
    // const deletedPost = await deleteResponse.json();

    // const newState = postList.filter((post) => post.id !== deletedPost.id);
    // setPostList(newState);
    props.refreshUserProfile();
    await router.push(`/users/private-profile`);
    return deleteResponse;
  }

  // console.log('this is post', props.posts);
  return (
    <div>
      <Layout userObject={props.userObject}>
        <Head>
          <title>{props.user.username}</title>
          <meta
            name="description"
            content={`Profile Page of ${props.user.username}`}
          />
        </Head>

        <main>
          <div>
            {/* <h1 css={appNameStyles}>@{props.user.username}</h1> */}
            <div css={heroImageStyles}>
              <img
                src={props.user.heroImage}
                alt="hero pic"
                style={{ height: '300px', width: '80vw' }}
              />
            </div>
            <div css={appNameStyles}>
              <div css={profileInfoStyles}>
                <div>{props.user.username}'s spot!</div>
                <div>bio: {props.user.bio}</div>
              </div>
            </div>
            <div css={arrowStyles}>
              <Typography>
                <Link href="/">
                  <ArrowBackIcon />
                </Link>
              </Typography>
            </div>
            <div>
              <Grid container spacing={3}>
                {props.posts.map((post) => {
                  console.log(post);
                  return (
                    <Grid item md={4} key={`post-${post.id}`}>
                      <Card>
                        <Link href={`/posts/${post.id}`}>
                          <CardActionArea>
                            <CardMedia
                              component="img"
                              image={post.pictureUrl}
                              title={post.spotName}
                              height={400}
                            />
                            <CardContent>
                              <Typography>Spot: {post.spotName}</Typography>
                              <Typography>
                                <LocationOnIcon /> {post.location}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Link>
                        <CardActions>
                          {/* {props.userId === props.post.userId && ( */}
                          <Button
                            onClick={() => {
                              deletePostByPostId(post.id).catch(() => {});
                            }}
                            variant="outlined"
                            size="small"
                            color="primary"
                          >
                            <DeleteIcon />
                          </Button>
                          {/* )} */}
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          </div>
        </main>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    const posts = await getPostsByUserId(user.id);
    // const heroImage = await getHeroImageByUsername(user.username);
    return {
      props: {
        user: user,
        posts: posts,
        // heroImage: heroImage,
      },
    };
  }

  return {
    redirect: {
      destination: '/login?returnTo=/users/private-profile',
      permanent: false,
    },
  };
}
