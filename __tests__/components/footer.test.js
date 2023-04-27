import { render, screen, fireEvent } from '@testing-library/react';
import Footer from '@/components/footer.js';

global.gtag = jest.fn();

describe('Footer Links', () => {
    it('should render the correct links', () => {
        render(<Footer />);
        const aboutLink = screen.getByText('About');
        const publicationsLink = screen.getByText('Publications');
        const contributingLink = screen.getByText('Contributing');
        const governanceLink = screen.getByText('Governance');
        const documentationLink = screen.getByText('Documentation');
        const sourceLink = screen.getByText('Source');
        const searchLink = screen.getByText('Search');
        const mailingListsLink = screen.getByText('Mailing Lists');
        const websiteSourceLink = screen.getByText('Website Source');

        expect(aboutLink).toHaveAttribute('href', '/about');
        expect(publicationsLink).toHaveAttribute('href', 'https://www.gem5.org/publications/');
        expect(contributingLink).toHaveAttribute('href', 'https://www.gem5.org/contributing/');
        expect(governanceLink).toHaveAttribute('href', 'https://www.gem5.org/governance/');
        expect(documentationLink).toHaveAttribute('href', 'https://www.gem5.org/documentation/');
        expect(sourceLink).toHaveAttribute('href', 'https://gem5.googlesource.com/public/gem5');
        expect(searchLink).toHaveAttribute('href', 'https://www.gem5.org/search/');
        expect(mailingListsLink).toHaveAttribute('href', 'https://www.gem5.org/mailing_lists/');
        expect(websiteSourceLink).toHaveAttribute('href', 'https://github.com/Gem5Vision/gem5-resources-website');
    });

    it('should delete cookies when reset cookies button is clicked', () => {
        render(<Footer />);
        const resetCookiesButton = screen.getByText('Reset Cookies');
        fireEvent.click(resetCookiesButton);
        expect(localStorage.getItem('CookieConsent')).toBeNull();
        expect(document.cookie).toBe('');
    });
});