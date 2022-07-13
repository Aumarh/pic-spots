import { css } from '@emotion/react';
import { Typography } from '@mui/material';

const footerStyles = css`
  color: #0a0a0a;
  padding: 6px 0;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.43;
  letter-spacing: 0.01071em;
`;

export default function Footer() {
  return (
    <footer css={footerStyles}>
      <Typography>Ⓒ Pic Spots 2022. All Rights Reserved.</Typography>
    </footer>
  );
}
