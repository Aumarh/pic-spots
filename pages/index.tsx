import LocationOnIcon from '@mui/icons-material/LocationOn';
// import { css } from '@emotion/react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
// import ImageList from '@mui/material/ImageList';
// import ImageListItem from '@mui/material/ImageListItem';
// import ImageListItemBar from '@mui/material/ImageListItemBar';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import { getPosts, getUserByValidSessionToken, Post } from '../util/database';

// const appNameStyles = css`
//   font-family: 'Allura', cursive;
//   font-size: 2.5rem;
//   font-weight: bold;
//   text-align: center;
// `;

type Props = {
  refreshUserProfile: () => Promise<void>;
  userObject: { username: string };
  posts: Post[];
};
export default function Home(props: Props) {
  useEffect(() => {
    props
      .refreshUserProfile()
      .catch(() => console.log('refresh user profile failed'));
  }, [props]);

  return (
    <div>
      <Layout userObject={props.userObject}>
        <Head>
          <title>Pic Spots</title>
          <meta
            name="description"
            content="Pic Spot is a web app that help folks new to Vienna find picture perfect spots for their photos."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          {/* <h1 css={appNameStyles}>Picture perfects spots in Vienna</h1> */}

          <Grid container spacing={2}>
            {props.posts.map((post) => {
              console.log(post);
              return (
                <Grid item md={4} key={`post-${post.id}`}>
                  <Card>
                    <Link href={`/posts/${post.id}`}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          image={post.pictureUrl}
                          title={post.spotName}
                          height={400}
                        />
                        <CardContent>
                          <Typography>Spot: {post.spotName}</Typography>
                          <Typography>
                            <LocationOnIcon /> {post.location}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Link>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </main>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const posts = await getPosts();
  console.log(posts);

  const user = await getUserByValidSessionToken(
    context.req.cookies.sessionToken,
  );

  if (user) {
    return {
      props: { user: user, posts: posts },
    };
  }

  return {
    redirect: {
      destination: '/login?returnTo=/',
      permanent: false,
    },
  };
}
