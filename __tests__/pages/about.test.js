import React from 'react';
import { render } from '@testing-library/react';
import About from '@/pages/about';
import about from '@/pages/about.md';

const aboutMock = '# This is a mock about page';

// Mock the about file
jest.mock('@/pages/about.md', () => {
  return aboutMock;
});

describe('About component', () => {
    it('renders without crashing', () => {
      render(<About />);
    });

    it('renders a markdown body with the mock about content', () => {
        const { getByText } = render(<About />);
        const aboutText = getByText(/This is a mock about page/i);
        expect(aboutText).toBeInTheDocument();
    });
});