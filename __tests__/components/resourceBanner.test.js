import { render, screen, fireEvent, act } from '@testing-library/react';
import Banner from '@/components/resourceBanner';

const setShowMetadata = jest.fn();

describe('Banner', () => {
    it('should render placeholder banner', () => {
        render(<Banner resource={{}} />);
    });

    it('should render the banner', () => {
        render(<Banner
            resource={{
                "category": "simpoint",
                "id": "batman",
                "architecture": "X86",
                "tags": [],
                "resource_version": "1.0.0",
                "database": "local"
            }}
            setShowMetadata={setShowMetadata}
        />);
        const database = screen.getByLabelText('Database Name');
        expect(database).toHaveTextContent('local /');
        const category = screen.getByLabelText('Resource Category');
        expect(category).toHaveTextContent('Simpoint');
        const id = screen.getByLabelText('Resource ID');
        expect(id).toHaveTextContent('batman');
        const version = screen.getByLabelText('Resource Version');
        expect(version).toHaveTextContent('1.0.0');
    });

    it('should render the banner with tags', () => {
        render(<Banner
            resource={{
                "category": "simpoint",
                "id": "batman",
                "architecture": "RISCV",
                "tags": ["tag1", "tag2"],
                "resource_version": "1.10.0",
                "database": "local"
            }}
            setShowMetadata={setShowMetadata}
        />);
        const tag1 = screen.getByLabelText('Tag tag1');
        expect(tag1).toHaveTextContent('tag1');
        const tag2 = screen.getByLabelText('Tag tag2');
        expect(tag2).toHaveTextContent('tag2');
    });
});