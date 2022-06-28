import { css } from '@emotion/react';
import { Container } from '@mui/material';
import Head from 'next/head';
import Footer from './Footer';
import Header from './Header';

const mainStyles = css`
  min-height: 82vh;
`;

export default function Layout(props) {
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
      <Header user={props.user} refreshUserProfile={props.refreshUserProfile} />
      <Container css={mainStyles}>{props.children}</Container>
      <Footer />
    </div>
  );
}
