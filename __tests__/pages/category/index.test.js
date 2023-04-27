import Category from "@/pages/category";
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import schema from "../../schema.json"
// Mock the fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(schema),
    })
);

jest.mock('../../../pages/category/workload.md', () =>
    Promise.resolve("This is test workload")
);

describe('Category component', () => {
    it('renders without crashing', async () => {
        act(() => {
            render(<Category />);
        });
        await waitFor(() => {
            const categoryTitle = screen.getByText('Categories');
            expect(categoryTitle).toBeInTheDocument();
            let cards = screen.queryAllByLabelText('card');
            expect(cards).toHaveLength(15);
        });
    });

    it('renders /category#workload', async () => {
        window.location.hash = 'workload';
        act(() => {
            render(<Category />);
        });
        await waitFor(() => {
            expect(screen.queryAllByText('View All Workloads')).toHaveLength(1);
            expect(window.location.hash).toBe('#workload');
        });
    });
});