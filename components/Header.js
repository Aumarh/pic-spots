import { css } from '@emotion/react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import PeopleIcon from '@mui/icons-material/People';
import Icon from '@mui/material/Icon';
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
    /* html,
    body {
      margin: 0;
      padding: 0;
    } */
  }
`;
const headerGrowStyles = css`
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 10px;

  a {
    margin-left: 10px;
  }
  :hover {
    cursor: pointer;
  }
`;

export default function Header(props) {
  return (
    <div css={navBarStyles}>
      <div position="static" css={brandStyles}>
        <div css={headerGrowStyles}>
          <Link href="/">PicSpots</Link>
          <Link href="/users/private-profile">
            <AccountCircleIcon {...(props.user && props.user.heroImage)} />
          </Link>
          <Link href="/community">
            <PeopleIcon />
          </Link>
          <Link href="/upload">
            <Icon sx={{ fontSize: 30 }}>
              <AddAPhotoIcon />
            </Icon>
          </Link>
          <Link href="/logout">Sign out</Link>
        </div>
      </div>
    </div>
  );
}
