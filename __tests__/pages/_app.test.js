import React from 'react';
import { render } from '@testing-library/react';
import Router from 'next/router';
import App from '@/pages/_app';

jest.mock('next/router', () => ({
    useRouter: () => ({
        pathname: '/test',
    }),
    events: {
        on: jest.fn(),
        off: jest.fn(),
    },
}));

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
});

describe('App', () => {
  it('should render the layout and component', () => {
    const Component = () => <div>Test Component</div>;
    const pageProps = { testProp: 'test' };
    const { getByText } = render(<App Component={Component} pageProps={pageProps} />);
    expect(getByText('Test Component')).toBeInTheDocument();
    expect(getByText('gem5 Resources')).toBeInTheDocument();
  });
});
