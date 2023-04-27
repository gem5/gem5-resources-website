import { render, screen, fireEvent } from '@testing-library/react';
import MyCards from '@/components/cards';

describe('Cards', () => {
    beforeEach(() => {
        render(<MyCards />);
    });

    it('should render all the cards', () => {
        const card1 = screen.getByText('riscv-ubuntu-20.04-boot');
        const card2 = screen.getByText('arm-hello64-static');
        const card3 = screen.getByText('x86-ubuntu-18.04-img');
        expect(card1).toBeInTheDocument();
        expect(card2).toBeInTheDocument();
        expect(card3).toBeInTheDocument();
    });
});