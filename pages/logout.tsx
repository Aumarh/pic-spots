import { css } from '@emotion/react';
import { Button } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';

const appNameStyles = css`
  font-family: 'Allura', cursive;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
`;

const linkStyles = css`
  text-decoration: none;
`;

export default function LogOut() {
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

      <main>
        <h1 css={appNameStyles}>See you next time.</h1>
        <Button variant="contained">
          <Link href="/sign_in" css={linkStyles}>
            Sign in
          </Link>
        </Button>
      </main>
    </div>
  );
}
