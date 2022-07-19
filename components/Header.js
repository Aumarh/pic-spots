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

  a {
    margin-left: 10px;
  }
  :hover {
    cursor: pointer;
  }
  div {
    /* background-color: yellow; */
    padding: 6px;
    display: none;
  }

  span:hover + p {
    display: block;
  }
  .profileIcon {
  }
`;

export default function Header(props) {
  return (
    <div css={navBarStyles}>
      <div position="static" css={brandStyles}>
        <div css={headerGrowStyles}>
          <Link href="/">PicSpots</Link>
          <Link href="/users/private-profile">
            <AccountCircleIcon
              {...(props.user && props.user.heroImage)}
              className="profileIcon"
            />
          </Link>
          <Link href="/community">
            <PeopleIcon className="communityIcon" />
          </Link>
          <Link href="/upload">
            <Icon sx={{ fontSize: 30 }}>
              <AddAPhotoIcon className="photoIcon" />
            </Icon>
          </Link>
          <Link href="/logout">Sign out</Link>
        </div>
      </div>
    </div>
  );
}
