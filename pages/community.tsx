import { css } from '@emotion/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Grid, Stack, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
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

const userListStyles = css`
  margin-bottom: 30px;

  a {
    text-decoration: none;
    color: inherit;
  }

  a:hover {
    text-decoration: underline;
  }
`;
// const userNameStyles = css``;

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
                  <div css={userListStyles} key={`users-${user.id}`}>
                    <Stack direction="row" spacing={2}>
                      <Avatar
                        alt={user.username}
                        src={user.heroImage}
                        sx={{ width: 40, height: 40 }}
                      />
                      <p>
                        Spot of:{' '}
                        <Link href={`/users/${user.id}`}>{user.username}</Link>
                      </p>
                    </Stack>
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
