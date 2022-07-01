import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { createCsrfToken } from '../../util/auth';
import { getUserById, getValidSessionByToken, User } from '../../util/database';

const appNameStyles = css`
  font-family: 'Allura', cursive;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
`;

type Props = { user?: User };

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
      <Head>
        <title>{props.user.username}</title>
        <meta
          name="description"
          content="Pic Spot is an web app that helps folks new to Vienna find picture perfect spots around Vienna"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main>
          <h1 css={appNameStyles}>User #{props.user.username}</h1>
          <div>username: {props.user.username}</div>
          <div>Bio: {props.user.bio}</div>
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

  // const userId = context.query.userId;
  // const posts = await getPostsByUserId(Number(userId));

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
  const csrfToken = createCsrfToken(session.csrfSeed);
  return {
    props: {
      csrfToken: csrfToken,
    },
  };
}
