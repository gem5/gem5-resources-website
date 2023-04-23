import { render, screen, fireEvent, act } from '@testing-library/react';
import ReadmeTab from '@/components/tabs/readmeTab';

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve("Test"),
    })
);

describe('ReadmeTab component', () => {
    it('should render correctly with default props', () => {
        render(<ReadmeTab github_url="" />);
    });

    it('should render correctly with github_url', () => {
        act(() => {
            render(<ReadmeTab github_url="https://github.com/gem5/gem5-resources/tree/develop/src/x86-ubuntu" />);
        });
    });

    it('should render no README.md with github_url', () => {
        act(() => {
            render(<ReadmeTab github_url="https://github.com/gem5/gem5-resources/tree/develop/src/simple" />);
        });
    });

    it('should render no valid GitHub URL with github_url', () => {
        act(() => {
            render(<ReadmeTab github_url="Atharav Solutions" />);
        });
    });
});