import React from 'react';
import { render } from '@testing-library/react';
import Help from '@/pages/help';
import help from '@/pages/help.md';

const helpMock = '# This is a mock help page';

// Mock the help file
jest.mock('@/pages/help.md', () => {
  return helpMock;
});

describe('Help component', () => {
    it('renders without crashing', () => {
      render(<Help />);
    });

    it('renders a markdown body with the mock help content', () => {
        const { getByText } = render(<Help />);
        const helpText = getByText(/This is a mock help page/i);
        expect(helpText).toBeInTheDocument();
    });
});