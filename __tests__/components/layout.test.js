import { render, screen } from '@testing-library/react';
import Layout from '@/components/layout';
import { useRouter } from 'next/router';

useRouter.mockReturnValue({
  pathname: '/',
  push: jest.fn(),
});

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

describe('Layout component', () => {
    it('renders Topbar, main, ScrollToTop and Footer components', () => {
        const { queryByLabelText } = render(<Layout />);
        const main = queryByLabelText(/main/i);
        expect(main).toBeInTheDocument();
      });

    it('sets the minHeight style of the main element to "calc(100vh - 100px)"', () => {
        const { queryByLabelText } = render(<Layout />);
        const main = queryByLabelText(/main/i);
    
        expect(main).toHaveStyle('minHeight: calc(100vh - 100px)');
      });
});
