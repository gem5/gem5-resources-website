import { render, screen, fireEvent } from '@testing-library/react';
import MetaData from '@/components/resourceMetadata';

describe('MetaData component', () => {
    it('should render correctly with default props', () => {
        render(<MetaData resource={{}} />);

        const authorLabel = screen.getByText('Author');
        expect(authorLabel).toBeInTheDocument();

        const descriptionLabel = screen.getByText('Description');
        expect(descriptionLabel).toBeInTheDocument();

        const licenseLabel = screen.getByText('License');
        expect(licenseLabel).toBeInTheDocument();

        const propertiesLabel = screen.getByText('Properties');
        expect(propertiesLabel).toBeInTheDocument();

        const dependLabel = screen.getByText('Depend on this resource');
        expect(dependLabel).toBeInTheDocument();
    });

    //   it('should show metadata when `showMetadata` prop is true', () => {
    //     render(<MetaData showMetadata={true} />);

    //     const backButton = screen.getByRole('button');
    //     expect(backButton).toBeInTheDocument();

    //     const metadataTitle = screen.getByText('Metadata');
    //     expect(metadataTitle).toBeInTheDocument();
    //   });

    //   it('should call `setShowMetadata` function when back button is clicked', () => {
    //     const setShowMetadata = jest.fn();
    //     render(<MetaData showMetadata={true} setShowMetadata={setShowMetadata} />);

    //     const backButton = screen.getByRole('button');
    //     userEvent.click(backButton);

    //     expect(setShowMetadata).toHaveBeenCalledWith(false);
    //   });
});
