import { act, render, screen, waitFor } from '@testing-library/react';
import ExampleTab from '@/components/tabs/exampleTab';

describe('exampleTab', () => {
    it('renders the exampleTab component when examples are not tested', async () => {
        const exampleContent = [{
            url: "https://www.gem5.org",
            content: "def issue(numbers):\n Resource(\"scope\")",
            tested: false,
        }];
        act(() => {
            render(<ExampleTab exampleContent={exampleContent} />);
        });
        await waitFor(() => expect(screen.getByText(/scope/i)).toBeInTheDocument());
        expect(screen.queryAllByLabelText("Tested Check")).toHaveLength(0);
    });

    it('renders the exampleTab component when examples are tested', async () => {
        const exampleContent = [{
            url: "https://www.gem5.org",
            content: "def issue(numbers):\n Resource(\"scope\")",
            tested: true,
        }];
        act(() => {
            render(<ExampleTab exampleContent={exampleContent} />);
        });
        await waitFor(() => expect(screen.getByText(/scope/i)).toBeInTheDocument());
        expect(screen.getByLabelText("Tested Check")).toBeInTheDocument();
    });
});