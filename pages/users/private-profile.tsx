import { css } from '@emotion/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
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
  text-align: center;
`;

type Props = {
  user: User;
  userObject: { username: string };
  posts: Post[];
  // spotName: string;
  // locationId: string;
  // userId: number;
};

export default function PrivateProfile(props: Props) {
  // if (!props.user) {
  //   return (
  //     <>
  //       <Head>
  //         <title>User not found</title>
  //         <meta name="description" content="User not found" />
  //       </Head>
  //       <h1>404 - User not found</h1>
  //       Better luck next time
  //     </>
  //   );
  // }

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
          {/* <h1 css={appNameStyles}>@{props.user.username}</h1> */}
          <div>
            <img
              src="https://res.cloudinary.com/cscorner/image/upload/v1657043409/cpa2alxt4drdmascdlwj.jpg"
              alt="hero pic"
              style={{ height: '300px', width: '80vw' }}
            />
          </div>
          <div css={appNameStyles}>
            <div>
              My spot{' '}
              <div>
                <span>{props.user.username}</span>
              </div>
              <div>bio:</div>
              <span>{props.user.bio}</span>
            </div>
          </div>
          <div>
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
                          />
                          <CardContent>
                            <Typography>{post.spotName}</Typography>
                          </CardContent>
                        </CardActionArea>
                      </Link>
                      <CardActions>
                        <Button variant="outlined" size="small" color="primary">
                          <DeleteIcon />
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
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
    return {
      props: {
        user: user,
        posts: posts,
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
