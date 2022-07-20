import { css } from '@emotion/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Typography } from '@mui/material';
// import Avatar from '@mui/material/Avatar';
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
  background-color: #c4cccc;
  width: 25px;
  border-radius: 8px;
  padding: 4px;

  :hover {
    cursor: pointer;
  }
`;

const communityContainerStyles = css`
  /* display: flex; */

  .container {
    display: flex;
    flex-direction: column;
    /* background: #eff8fc; */
  }

  p {
    font-family: 'Allura', cursive;
    font-size: 2rem;
    /* font-weight: bold; */
    text-align: center;
    margin-bottom: 0px;
  }

  button {
    /* text-decoration: none; */
    color: black;
    background: #a8c5f9;
    text-align: center;
    border-radius: 8px;
    padding: 10px;
    /* margin: 0 50px; */
    margin-top: 4px;
    margin-left: 10px;
    margin-bottom: 40px;
    font-size: 17px;
    border: transparent;
    cursor: pointer;
    :hover {
      background-color: #6b95e4;
      box-shadow: #163923 0 -6px 8px inset;
      transform: scale(1.125);
    }
  }

  img {
    border-radius: 12px;
  }
`;

const userListStyles = css`
  display: flex;
  width: 80vw;
  flex-wrap: wrap;
  margin-bottom: 30px;
  justify-content: space-evenly;

  .container {
    background: #eff8fc;
    border-radius: 8px;
    width: 300px;
    height: 323px;
    margin: 20px;

    align-items: center;
  }

  a {
    text-decoration: none;
    color: black;
  }

  :hover {
    text-decoration: none;
  }
`;
// const buttonStyles = css`
// `;

type Props = {
  users: User[];
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

        <div css={communityContainerStyles}>
          <div>
            <div css={userListStyles}>
              {props.users.map((user) => {
                return (
                  <div key={`users-${user.id}`} className="container">
                    <div>
                      <img
                        alt={user.username}
                        src={user.heroImage}
                        style={{ height: '200px', width: '200px' }}
                      />
                    </div>
                    <div>
                      <p>{user.username}'s Spot </p>
                      <Link href={`/users/${user.id}`}>
                        <button>Discover spot</button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
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
