import { css } from '@emotion/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Grid, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { getUsers, User } from '../util/database';

const appNameStyles = css`
  font-family: 'Allura', cursive;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
`;

const arrowStyles = css`
  margin-right: 10px;
  margin-bottom: 15px;

  :hover {
    cursor: pointer;
  }
`;

type Props = {
  users: User;
  username: string;
};

export default function community(props: Props) {
  return (
    <div>
      <Layout>
        <Head>
          <title>Pic Spot Community</title>
          <meta
            name="description"
            content="Pic Spot is an web app that helps folks new to Vienna find picture perfect spots around Vienna"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1 css={appNameStyles}>Pic spot community</h1>
        <div css={arrowStyles}>
          <Typography>
            <Link href="/">
              <ArrowBackIcon />
            </Link>
          </Typography>
        </div>
        <Grid>
          <Stack spacing={3}>
            <div>
              {props.users.map((user) => {
                return (
                  <div key={`users-${user.id}`}>
                    <div>
                      Spot of:{' '}
                      <Link href={`/users/${user.id}`}>{user.firstName}</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </Stack>
        </Grid>
      </Layout>
    </div>
  );
}

export async function getServerSideProps() {
  const users = await getUsers();

  return {
    props: {
      users: users,
    },
  };
}
