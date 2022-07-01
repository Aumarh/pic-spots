// import { css } from '@emotion/react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Head from 'next/head';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import { getUserByValidSessionToken } from '../util/database';

// const appNameStyles = css`
//   font-family: 'Allura', cursive;
//   font-size: 2.5rem;
//   font-weight: bold;
//   text-align: center;
// `;

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
          {/* <h1 css={appNameStyles}>Picture perfects spots in Vienna</h1> */}
          <ImageList variant="standard" cols={3} gap={8}>
            {itemData.map((item) => (
              <ImageListItem key={item.img}>
                <img
                  src={`${item.img}?w=248&fit=crop&auto=format`}
                  srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.spotName}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.spotName}
                  subtitle={item.location}
                  position="below"
                />
              </ImageListItem>
            ))}
          </ImageList>
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

const itemData = [
  {
    img: 'https://res.cloudinary.com/cscorner/image/upload/v1656667358/whmrdctrojuvwiup1dqh.jpg',
    spotName: 'Prata',
    location: '1020 Wien',
  },
  {
    img: 'https://res.cloudinary.com/cscorner/image/upload/v1656667358/whmrdctrojuvwiup1dqh.jpg',
    spotName: 'Prata',
    location: '1020 Wien',
  },
  {
    img: 'https://res.cloudinary.com/cscorner/image/upload/v1656667358/whmrdctrojuvwiup1dqh.jpg',
    spotName: 'Prata',
    location: '1020 Wien',
  },
  {
    img: 'https://res.cloudinary.com/cscorner/image/upload/v1656668800/wdwjgkuhgmi2wacxv1ej.jpg',
    spotName: 'Jubilaumswarte',
    location: 'Johann-Staud-Straße',
  },
  {
    img: 'https://res.cloudinary.com/cscorner/image/upload/v1656668800/wdwjgkuhgmi2wacxv1ej.jpg',
    spotName: 'Jubilaumswarte',
    location: 'Johann-Staud-Straße',
  },
  {
    img: 'https://res.cloudinary.com/cscorner/image/upload/v1656668800/wdwjgkuhgmi2wacxv1ej.jpg',
    spotName: 'Jubilaumswarte',
    location: 'Johann-Staud-Straße',
  },
  {
    img: 'https://res.cloudinary.com/cscorner/image/upload/v1656683383/ezsn98jyncewezsnvhwe.jpg',
    spotName: 'Prata',
    location: '1020 Wien',
  },
  {
    img: 'https://res.cloudinary.com/cscorner/image/upload/v1656683383/ezsn98jyncewezsnvhwe.jpg',
    spotName: 'Prata',
    location: '1020 Wien',
  },
  {
    img: 'https://res.cloudinary.com/cscorner/image/upload/v1656683383/ezsn98jyncewezsnvhwe.jpg',
    spotName: 'Prata',
    location: '1020 Wien',
  },
  {
    img: 'https://res.cloudinary.com/cscorner/image/upload/v1656669044/vflfntpqyk45pn7sdxyo.jpg',
    spotName: 'Belvedere',
    location: 'Prinz Eugen-Straße',
  },
  {
    img: 'https://res.cloudinary.com/cscorner/image/upload/v1656684132/pn5vgslzdulqoo8qk9dx.jpg',
    spotName: 'Prata',
    location: '1020 Wien',
    Tags: '#outdoor',
  },
  // {
  //   img: 'https://res.cloudinary.com/cscorner/image/upload/v1656669044/vflfntpqyk45pn7sdxyo.jpg',
  //   spotName: 'Belvedere',
  //   location: 'Prinz Eugen-Straße',
  // },
];
