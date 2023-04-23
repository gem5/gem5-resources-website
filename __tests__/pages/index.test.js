import { render, screen, act, fireEvent } from '@testing-library/react';
import Home from '@/pages/index.js';
import schema from "../schema.json"
import { useRouter } from 'next/router';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(schema),
  })
);

const push = jest.fn();

describe('Home component', () => {
  beforeEach(async () => {
    useRouter.mockReturnValue({
      push
    });
    await act(() => {
      render(<Home />);
    });
  });

  test('renders the logo', () => {
    const logo = screen.getByRole('img', { name: /gem5 logo/i })
    expect(logo).toBeInTheDocument();
  });

  test('Checks for 3 cards in the getting started section', () => {
    const cardsContainer = screen.getByLabelText('Getting Started Cards');
    expect(cardsContainer).toBeInTheDocument();
    const cards = cardsContainer.children;
    expect(cards).toHaveLength(3);
  });

  test('Checks for 3 cards in the categories section', () => {
    const cardsContainer = screen.getByLabelText('Category Cards');
    expect(cardsContainer).toBeInTheDocument();
    const cards = cardsContainer.children;
    expect(cards).toHaveLength(3);
  });

  test('navigates to the resources page when searching', () => {
    let query = 'gem5';
    const searchBox = screen.getByPlaceholderText('Search Resources');
    expect(searchBox).toBeInTheDocument();
    fireEvent.change(searchBox, { target: { value: query } });
    expect(searchBox.value).toBe(query);
    const mockEvent = { preventDefault: jest.fn(), target: [{ value: query }] };
    fireEvent.submit(searchBox, mockEvent);
    expect(push).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/resources',
      query: { q: query }
    }));
  });
});
