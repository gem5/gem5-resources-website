import { render, screen, fireEvent } from '@testing-library/react';
import CategoryHeader from '@/components/categoryHeader';

describe('Category Header', () => {
    it('should render the binary header', () => {
        render(<CategoryHeader category="binary" />);
        const header = screen.getByText('Binary');
        expect(header).toBeInTheDocument();
    });

    it('should render the disk-image header', () => {
        render(<CategoryHeader category="diskimage" />);
        const header = screen.getByText('Diskimage');
        expect(header).toBeInTheDocument();
    });
});