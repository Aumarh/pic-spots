import { css } from '@emotion/react';
import Head from 'next/head';
import Layout from '../components/Layout';

const appNameStyles = css`
  font-family: 'Allura', cursive;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
`;

export default function Home() {
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
