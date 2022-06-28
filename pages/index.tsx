import { css } from '@emotion/react';
import Head from 'next/head';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import { getUserByValidSessionToken } from '../util/database';

const appNameStyles = css`
  font-family: 'Allura', cursive;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
`;

type Props = {
  refreshUserProfile: () => Promise<void>;
};
export default function Home(props: Props) {
  useEffect(() => {
    props
      .refreshUserProfile()
      .catch(() => console.log('refresh user profile failed'));
  }, [props]);

  return (
    <div>
      <Head>
        <title>Pic Spots</title>
        <meta
          name="description"
          content="Pic Spot is an web app that helps folks new to Vienna find picture perfect spots around Vienna"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main>
          <h1 css={appNameStyles}>Picture perfects spots in Vienna</h1>
        </main>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    return {
      props: {},
    };
  }

  return {
    redirect: {
      destination: '/login?returnTo=/',
      permanent: false,
    },
  };
}
