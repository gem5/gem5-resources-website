import { render, screen, fireEvent, act } from '@testing-library/react';
import ChangelogTab from '@/components/tabs/changelogTab';

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve("Test"),
    })
);

describe('ChangelogTab component', () => {
    it('should render correctly with default props', () => {
        render(<ChangelogTab github_url="" />);
    });

    it('should render correctly with github_url', () => {
        act(() => {
            render(<ChangelogTab github_url="https://github.com/gem5/gem5-resources/tree/develop/src/x86-ubuntu" />);
        });
    });

    it('should render no valid GitHub URL with github_url', () => {
        act(() => {
            render(<ChangelogTab github_url="Atharav Solutions" />);
        });
    });
});