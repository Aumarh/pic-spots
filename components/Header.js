import { css } from '@emotion/react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import PeopleIcon from '@mui/icons-material/People';
import Icon from '@mui/material/Icon';
import Head from 'next/head';
import Link from 'next/link';

const brandStyles = css`
  a {
    font-weight: bold;
    font-size: 1.8rem;
    text-decoration: none;
    font-family: allura;
    margin-right: 1rem;
  }
`;

const navBarStyles = css`
  /* background: #8ec6fa; */
  padding-top: 0.1rem;
  margin: 0;
  a {
    color: #0a0a0a;
    margin-left: 10px;
    text-decoration: none;

    /* float: left;
    display: block;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px; */
  }

  Link.active {
    background-color: #04aa6d;
  }
`;

const headerGrowStyles = css`
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 10px;

  a {
    margin-left: 10px;
  }
  :hover {
    cursor: pointer;
  }

  /* .hide {
    display: none;
  }

  .myDiv:hover + .hide {
    display: block;
  } */
  /* div {
    background-color: yellow;
    padding: 6px;
    display: none;
  } */

  /* .myDIV:hover + .hide {
    display: block;
  } */
  /* a.active + span:hover {
    display: inline-block;
    text-overflow: initial;
    width: auto;
    overflow: hidden;
    padding: 0 5px;
    z-index: 2;
  } */
`;

export default function Header(props) {
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div css={navBarStyles}>
        <div position="static" css={brandStyles}>
          <div css={headerGrowStyles}>
            <div>
              <Link href="/">PicSpots</Link>
            </div>
            <div>
              <Link className="myDiv" href="/users/private-profile">
                <a>
                  <AccountCircleIcon
                    {...(props.user && props.user.heroImage)}
                  />
                  {/* <span>profile</span> */}
                </a>
              </Link>
            </div>
            {/* <div className="hide">profile</div> */}
            <div>
              <Link className="myDiv" href="/community">
                <PeopleIcon />
              </Link>
            </div>
            {/* <div className="hide">community</div> */}
            <div>
              <Link className="myDiv" href="/upload">
                <Icon sx={{ fontSize: 30 }}>
                  <AddAPhotoIcon />
                </Icon>
              </Link>
            </div>
            {/* <div className="hide">upload</div> */}
            <div>
              <Link href="/logout">Sign out</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
