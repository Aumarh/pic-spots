import { css } from '@emotion/react';

const heroStyle = css`
  background: url('heroimage.jpeg');
  position: absolute;
  width: 1512px;
  height: 982px;
  left: 0px;
  top: 0px;

  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
`;

const loginBannerStyles = css`
  box-sizing: border-box;
  border-radius: 2px;
  position: absolute;
  width: 320px;
  height: 500px;
  left: 207px;
  top: 190px;

  background: #d9d9d9;
  mix-blend-mode: screen;
  border: 1px solid #000000;
`;
const usernameInputStyles = css`
  position: absolute;
  left: 17.33%;
  right: 63.56%;
  top: 35.74%;
  bottom: 58.83%;
  width: 191px;
  background: #ffffff;
  border-radius: 2px;
  color: #000000;
`;

const passwordInputStyles = css`
  width: 191px;
  position: absolute;
  left: 17.33%;
  right: 63.56%;
  top: 44.7%;
  bottom: 49.87%;
  color: #000000;
  background: #ffffff;
  border-radius: 2px;
`;

const createButtonStyles = css`
  /* Button */

  position: absolute;
  left: 17.33%;
  right: 63.56%;
  top: 70.37%;
  bottom: 24.21%;
  width: 200px;
  background: #1bd290;
  /* mix-blend-mode: screen; */
  border-radius: 2px;
  color: #000000;
`;

const signInButtonStyles = css`
  /* Button */

  position: absolute;
  left: 17.33%;
  right: 63.56%;
  top: 52.95%;
  bottom: 41.62%;
  width: 200px;
  background: #1b64d2;
  /* mix-blend-mode: screen; */
  border-radius: 2px;
  color: #000000;
`;

// const lineStyles = css`
//   /* Line 1 */

//   position: absolute;
//   width: 365px;
//   height: 0px;
//   left: 220px;
//   top: 639px;

//   border: 1px solid #000000;
// `;

const createAccountStyles = css`
  color: #000000;
  /* position: absolute; */
  width: 200px;
  height: 18px;
  left: 283px;
  top: 647px;
  font-style: italic;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
`;

export default function Hero() {
  return (
    <div css={heroStyle}>
      <div css={loginBannerStyles}>
        <div>
          <input placeholder="username" css={usernameInputStyles} />
          <input placeholder="password" css={passwordInputStyles} />
          <button css={signInButtonStyles}>Sign In</button>
        </div>
        <p css={createAccountStyles}>Don't have an account yet?</p>
        <div>
          <button css={createButtonStyles}>Create new account</button>
        </div>
      </div>
    </div>
  );
}
