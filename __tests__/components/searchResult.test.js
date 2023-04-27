import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchResult from '@/components/searchResult';

describe('Search Result', () => {
    beforeEach(() => {
        process.env.PRIVATE_RESOURCES = {
            "db1": {
                url: "resources.json",
                isMongo: false,
            }
        };
    });
    it('should render the search result', () => {
        render(<SearchResult
            resource={{
                "category": "simpoint",
                "id": "batman",
                "architecture": "X86",
                "tags": [],
                "resource_version": "1.0.0",
                "database": "db1"
            }}
        />);
        const database = screen.getByLabelText('Resource database');
        expect(database).toHaveTextContent('db1 /');
        const category = screen.getByLabelText('Resource category');
        expect(category).toHaveTextContent('simpoint');
        const id = screen.getByLabelText('Resource ID');
        expect(id).toHaveTextContent('batman');
        const version = screen.getByLabelText('Resource version');
        expect(version).toHaveTextContent('1.0.0');
    });

    it('should render the search result with tags', () => {
        render(<SearchResult
            resource={{
                "category": "binary",
                "id": "batman",
                "architecture": "RISCV",
                "tags": ["tag1", "tag2"],
                "resource_version": "1.10.0",
                "database": "db1"
            }}
        />);
        const tag1 = screen.getByLabelText('Tag tag1');
        expect(tag1).toHaveTextContent('tag1');
        const tag2 = screen.getByLabelText('Tag tag2');
        expect(tag2).toHaveTextContent('tag2');
    });
});