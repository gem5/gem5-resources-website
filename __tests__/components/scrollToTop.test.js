import { render, fireEvent } from '@testing-library/react';
import ScrollToTop from '@/components/scrollToTop';

describe('ScrollToTop component', () => {
    it('shows/hides button based on scroll position', () => {
        const { container } = render(<ScrollToTop />);
        const scrollToTop = container.querySelector('.scrollToTop');
        expect(scrollToTop).toHaveStyle('opacity: 0');

        window.pageYOffset = 400;
        fireEvent.scroll(window);
        expect(scrollToTop).toHaveStyle('opacity: 1');

        window.pageYOffset = 0;
        fireEvent.scroll(window);
        expect(scrollToTop).toHaveStyle('opacity: 0');
      });

      it('scrolls to the top when button is clicked', () => {
        window.scrollTo = jest.fn();
        const { getByRole } = render(<ScrollToTop />);
        const button = getByRole('button');
        fireEvent.click(button);
        expect(window.scrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: 'smooth',
        });
      });
});

