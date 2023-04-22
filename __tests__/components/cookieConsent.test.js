import { render, screen, fireEvent } from '@testing-library/react';
import CookieConsent from '@/components/cookieConsent';

global.gtag = jest.fn();

const hasUpdated = jest.fn();
describe('Cookie Consent', () => {
    beforeEach(() => {
        render(<CookieConsent showConsentOverlay={true} hasUpdated={hasUpdated} />);
    });

    it('should render all the buttons and images', () => {
        const cookieImage = screen.getByAltText('Cookie');
        const manageCookies = screen.getByText('Manage Cookies');
        const acceptAll = screen.getByText('Accept All');

        expect(cookieImage).toBeInTheDocument();
        expect(manageCookies).toBeInTheDocument();
        expect(acceptAll).toBeInTheDocument();
    });

    it('shouldn\'t render the modal when the component is rendered', () => {
        const modal = screen.queryByText('Cookie Policy');
        expect(modal).not.toBeInTheDocument();
    });

    it('should render the modal when manage cookies is clicked', () => {
        const cookieImage = screen.getByAltText('Cookie');
        const manageCookies = screen.getByText('Manage Cookies');
        fireEvent.click(manageCookies);
        const modal = screen.getByText('Cookie Policy');
        expect(modal).toBeInTheDocument();
        expect(cookieImage).not.toBeInTheDocument();
    });

    it('test when accept all is clicked', () => {
        const acceptAll = screen.getByText('Accept All');
        fireEvent.click(acceptAll);
        expect(hasUpdated).toHaveBeenCalled();
        expect(acceptAll).not.toBeInTheDocument();
    });

    it('should allow customized cookies', () => {
        const cookieImage = screen.getByAltText('Cookie');
        const manageCookies = screen.getByText('Manage Cookies');
        fireEvent.click(manageCookies);
        const modal = screen.getByText('Cookie Policy');
        expect(modal).toBeInTheDocument();
        expect(cookieImage).not.toBeInTheDocument();
        // get all inputs in the modal
        const inputs = screen.getAllByRole('checkbox');
        expect(inputs).toHaveLength(3);
        const requiredCookies = inputs[0];
        const preferencesCookies = inputs[1];
        const statisticsCookies = inputs[2];
        // check if they exist
        expect(requiredCookies).toBeInTheDocument();
        expect(preferencesCookies).toBeInTheDocument();
        expect(statisticsCookies).toBeInTheDocument();
        // check if they are unchecked
        expect(requiredCookies).toBeChecked();
        expect(preferencesCookies).toBeChecked();
        expect(statisticsCookies).toBeChecked();
        // check if they are disabled
        expect(requiredCookies).toBeDisabled();
        expect(preferencesCookies).not.toBeDisabled();
        expect(statisticsCookies).not.toBeDisabled();
        // uncheck all the cookies
        fireEvent.click(requiredCookies);
        fireEvent.click(preferencesCookies);
        fireEvent.click(statisticsCookies);
        // check if they are unchecked
        expect(requiredCookies).toBeChecked();
        expect(preferencesCookies).not.toBeChecked();
        expect(statisticsCookies).not.toBeChecked();

        const save = screen.getByText('Save');
        fireEvent.click(save);
        expect(hasUpdated).toHaveBeenCalled();
        expect(save).not.toBeInTheDocument();
        // check localStorage CookieConsent is set to "required"
        expect(localStorage.getItem('CookieConsent')).toBe(JSON.stringify({ "userPreference": "required" }));
    });
});