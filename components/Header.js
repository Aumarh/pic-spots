import { css } from '@emotion/react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleIcon from '@mui/icons-material/People';
import Icon from '@mui/material/Icon';
import Link from 'next/link';

const brandStyles = css`
  a {
    /* font-weight: bold; */
    font-size: 1.5rem;
    text-decoration: none;
  }
`;
const navBarStyles = css`
  /* background: #f9f4f4; */
  a {
    color: #0a0a0a;
    margin-left: 10px;
    text-decoration: none;
  }
`;
const headerGrowStyles = css`
  flex-grow: 1;
  display: flex;
  justify-content: space-between;

  a {
    margin-left: 10px;
  }
`;

export default function Header(props) {
  return (
    <div css={navBarStyles}>
      <div position="static" css={brandStyles}>
        <div css={headerGrowStyles}>
          <Link href="/">PicSpots</Link>
          <Link href="/users/private-profile">
            <AccountCircleIcon {...(props.user && props.user.username)} />
          </Link>
          {/* <Link href="/users/userId">
            <PeopleIcon />
          </Link> */}
          <Link href="/upload">
            <Icon sx={{ fontSize: 30 }}>+</Icon>
          </Link>
          <Link href="/logout">Sign out</Link>
        </div>
      </div>
    </div>
  );
}
