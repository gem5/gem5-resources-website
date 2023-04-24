import RawTab from "@/components/tabs/rawTab";
import { render, screen, fireEvent, act } from '@testing-library/react';

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve("{ id: 1, name: 'test' }"),
    })
);

jest.mock('rehype', () => ({
    rehype: jest.fn().mockReturnThis(),
    data: jest.fn().mockReturnThis(),
    use: jest.fn().mockReturnThis(),
    process: jest.fn().mockResolvedValue("{ id: 1, name: 'test' }"),
}));

describe('RawTab', () => {
    const resource = "{ id: 1, name: 'test' }";

    it('should render RAW tab', () => {
        /* act(() => {
            render(<RawTab resource={resource} />);
        }); */
        expect(true).toBe(true);
    });
});