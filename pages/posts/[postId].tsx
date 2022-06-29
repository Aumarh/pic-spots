import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import {
  getCommentsByPostId,
  getPostById,
  getUserByValidSessionToken,
  Post,
} from '../../util/database';

const appNameStyles = css`
  font-family: 'Allura', cursive;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
`;

type Props = {
  refreshUserProfile: () => void;
  userObject: { spotName: string; image: string };
  post: Post;

  postComments: {
    id: number;
    userId: number;
    postId: number;
    commentText: string;
    username: string;
    image: string;
  }[];
  id: number;
  username: string;
};

export default function PostDetails(props: Props) {
  if ('errors' in props) {
    return <h1>Not authenticated to view this page</h1>;
  }

  return (
    <div>
      <Head>
        <title>{props.username}</title>
        <meta
          name="description"
          content="Pic Spot is an web app that helps folks new to Vienna find picture perfect spots around Vienna"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main>
          <h1 css={appNameStyles}>User #{props.post.spotName}</h1>
          <div>id: {props.post.id}</div>
          <div>username: {props.post.spotName}</div>
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
  const postIdFromUrl = context.query.postId;
  const sessionToken = context.req.cookies.sessionToken;
  const loggedInUser = await getUserByValidSessionToken(sessionToken);

  // checking that the user param is a string
  if (!postIdFromUrl || Array.isArray(postIdFromUrl)) {
    return { props: {} };
  }

  const post = await getPostById(parseInt(postIdFromUrl));

  if (!postIdFromUrl) {
    context.res.statusCode = 404;
    return { props: {} };
  }

  if (!loggedInUser) {
    return {
      props: {
        error: 'You need to be logged in',
      },
    };
  }
  const postComments = await getCommentsByPostId(parseInt(postIdFromUrl));
  return {
    props: {
      post: post,
      postId: postIdFromUrl,
      userId: loggedInUser.id,
      postComments: postComments,
    },
  };
}
