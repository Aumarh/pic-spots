import { css } from '@emotion/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { createCsrfToken } from '../../util/auth';
import {
  getPostsByUserId,
  getUserById,
  getValidSessionByToken,
  Post,
  User,
} from '../../util/database';

const appNameStyles = css`
  font-family: 'Allura', cursive;
  font-size: 2.5rem;
  font-weight: bold;
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
  border-radius: 2px;

  width: 543px;
  height: 100px;
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
  user?: User;
  userObject: { username: string };
  posts: Post[];
  // spotName: string;
  // location: string;
  // userId: number;
};

export default function UserDetails(props: Props) {
  if ('errors' in props) {
    return <h1>Not authenticated to view this page</h1>;
  }

  if (!props.user) {
    return (
      <>
        <Head>
          <title>User not found</title>
          <meta name="description" content="User not found" />
        </Head>
        <h1>404 - User not found</h1>
        Better luck next time
      </>
    );
  }

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
          <div css={heroImageStyles}>
            <img
              src={props.user.heroImage}
              alt="hero pic"
              style={{ height: '300px', width: '80vw' }}
            />
          </div>
          <div css={appNameStyles}>
            <div css={profileInfoStyles}>
              <div>Spot of {props.user.username}</div>
              <div>bio: {props.user.bio}</div>
            </div>
          </div>
          <div css={arrowStyles}>
            <Typography>
              <Link href="/community">
                <ArrowBackIcon />
              </Link>
            </Typography>
          </div>
          <div>
            <h1 css={appNameStyles}>spot list</h1>
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
                            <Typography>Spot name: {post.spotName}</Typography>
                            <Typography>
                              <LocationOnIcon /> {post.location}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Link>
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

// Code in getServerSideProps runs only in
// Node.js, and allows you to do fancy things:
// - Read files from the file system
// - Connect to a (real) database
//
// getServerSideProps is exported from your files
// (ONLY FILES IN /pages) and gets imported
// by Next.js

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userIdFromUrl = context.query.userId;
  const posts = await getPostsByUserId(Number(userIdFromUrl));

  // checking that the user param is a string
  if (!userIdFromUrl || Array.isArray(userIdFromUrl)) {
    return { props: {} };
  }

  const user = await getUserById(parseInt(userIdFromUrl));

  if (!user) {
    context.res.statusCode = 404;
    return { props: {} };
  }
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);

  if (!session) {
    return {
      props: {
        error: "You're not authenticated",
      },
    };
  }
  const csrfToken = createCsrfToken(session.csrfSecret);
  return {
    props: {
      user: user,
      posts: posts,
      csrfToken: csrfToken,
    },
  };
}
