// import { css } from '@emotion/react';
import { Container } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Head from 'next/head';
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
  spotName: string;
  locationId: string;
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
            content="Pic Spot is an web app that helps folks new to Vienna find picture perfect spots around Vienna"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          {/* <h1 css={appNameStyles}>Picture perfects spots in Vienna</h1> */}
          <Container maxWidth="md">
            <ImageList variant="standard" cols={3} gap={8}>
              {props.posts.map((post) => {
                return (
                  <ImageListItem key={post.pictureUrl}>
                    <img
                      // src={`${item.img}?w=248&fit=crop&auto=format`}
                      src={post.pictureUrl}
                      // srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      alt="pic spot"
                      loading="lazy"
                    />
                    <ImageListItemBar
                      title={props.spotName}
                      subtitle={props.locationId}
                      position="below"
                    />
                  </ImageListItem>
                );
              })}
            </ImageList>
          </Container>
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

// const itemData = [
//   {
//     img: 'https://res.cloudinary.com/cscorner/image/upload/v1656667358/whmrdctrojuvwiup1dqh.jpg',
//     spotName: 'Prata',
//     location: '1020 Wien',
//   },
//   {
//     img: 'https://res.cloudinary.com/cscorner/image/upload/v1656667358/whmrdctrojuvwiup1dqh.jpg',
//     spotName: 'Prata',
//     location: '1020 Wien',
//   },
//   {
//     img: 'https://res.cloudinary.com/cscorner/image/upload/v1656667358/whmrdctrojuvwiup1dqh.jpg',
//     spotName: 'Prata',
//     location: '1020 Wien',
//   },
//   {
//     img: 'https://res.cloudinary.com/cscorner/image/upload/v1656668800/wdwjgkuhgmi2wacxv1ej.jpg',
//     spotName: 'Jubilaumswarte',
//     location: 'Johann-Staud-Straße',
//   },
//   {
//     img: 'https://res.cloudinary.com/cscorner/image/upload/v1656668800/wdwjgkuhgmi2wacxv1ej.jpg',
//     spotName: 'Jubilaumswarte',
//     location: 'Johann-Staud-Straße',
//   },
//   {
//     img: 'https://res.cloudinary.com/cscorner/image/upload/v1656668800/wdwjgkuhgmi2wacxv1ej.jpg',
//     spotName: 'Jubilaumswarte',
//     location: 'Johann-Staud-Straße',
//   },
//   {
//     img: 'https://res.cloudinary.com/cscorner/image/upload/v1656683383/ezsn98jyncewezsnvhwe.jpg',
//     spotName: 'Prata',
//     location: '1020 Wien',
//   },
//   {
//     img: 'https://res.cloudinary.com/cscorner/image/upload/v1656683383/ezsn98jyncewezsnvhwe.jpg',
//     spotName: 'Prata',
//     location: '1020 Wien',
//   },
//   {
//     img: 'https://res.cloudinary.com/cscorner/image/upload/v1656683383/ezsn98jyncewezsnvhwe.jpg',
//     spotName: 'Prata',
//     location: '1020 Wien',
//   },
//   {
//     img: 'https://res.cloudinary.com/cscorner/image/upload/v1656669044/vflfntpqyk45pn7sdxyo.jpg',
//     spotName: 'Belvedere',
//     location: 'Prinz Eugen-Straße',
//   },
//   {
//     img: 'https://res.cloudinary.com/cscorner/image/upload/v1656684132/pn5vgslzdulqoo8qk9dx.jpg',
//     spotName: 'Prata',
//     location: '1020 Wien',
//     Tags: '#outdoor',
//   },
// {
//   img: 'https://res.cloudinary.com/cscorner/image/upload/v1656669044/vflfntpqyk45pn7sdxyo.jpg',
//   spotName: 'Belvedere',
//   location: 'Prinz Eugen-Straße',
// },
// ];
