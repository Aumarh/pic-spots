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
                  alt={item.title}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.location}
                  subtitle={<span>by: {item.author}</span>}
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
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    author: '@bkristastucchio',
    location: 'schlacthaugasse',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    author: '@rollelflex_graphy726',
    location: 'schlacthaugasse',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
    author: '@helloimnik',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    author: '@nolanissac',
    location: 'schlacthaugasse',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    author: '@hjrc33',
    location: 'schlacthaugasse',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
    author: '@tjdragotta',
    location: 'schlacthaugasse',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
    author: '@katie_wasserman',
    location: 'schlacthaugasse',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
    author: '@silverdalex',
    location: 'schlacthaugasse',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
    author: '@shelleypauls',
    location: 'schlacthaugasse',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
    author: '@peterlaster',
    location: 'schlacthaugasse',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
    author: '@southside_customs',
    location: 'schlacthaugasse',
  },
];
