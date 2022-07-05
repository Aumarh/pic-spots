import { css } from '@emotion/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
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
  text-align: center;
`;

type Props = {
  user?: User;
  userObject: { username: string };
  posts: Post[];
  spotName: string;
  locationId: string;
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
          <div>
            <img src={props.user.heroImage} alt="hero pic" />
          </div>
          <div css={appNameStyles}>
            <div>
              Spot of{' '}
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
            <h1>post list</h1>
            <Container>
              <ImageList variant="standard" cols={3} gap={8}>
                {props.posts.map((post) => {
                  return (
                    <ImageListItem key={`post-${post.id}`}>
                      <Link href={`/posts/${post.id}`}>
                        <a>
                          <Image
                            // src={`${item.img}?w=248&fit=crop&auto=format`}
                            src={post.pictureUrl}
                            // srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt="pic spot"
                            loading="lazy"
                          />
                        </a>
                        <ImageListItemBar
                          title={props.spotName}
                          subtitle={props.locationId}
                          position="below"
                        />
                      </Link>
                    </ImageListItem>
                  );
                })}
              </ImageList>
            </Container>
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
