// import { render, screen } from '@testing-library/react';
// import App from '../../pages/index';

// describe('Should render the app without crashing', () => {
//   it('renders without crashing', () => {
//     render(
//       <App
//         refreshUserProfile={function (): Promise<void> {
//           throw new Error('Function not implemented.');
//         }}
//         userObject={{
//           username: '',
//         }}
//         posts={[]}
//       />,
//     );
//     expect(screen.getByText('Pic Spots')).toBeInTheDocument();
//   });
// });

// __tests__/index.test.jsx

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../../pages/index';

describe('Home', () => {
  it('renders a heading', () => {
    render(
      <Home
        refreshUserProfile={function (): Promise<void> {
          throw new Error('Function not implemented.');
        }}
        userObject={{
          username: '',
        }}
        posts={[]}
      />,
    );

    const heading = screen.getByRole('heading', {
      name: /pic spots/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
