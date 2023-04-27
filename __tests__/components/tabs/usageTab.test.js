import UsageTab from '@/components/tabs/usageTab'
import { act, render, screen, waitFor } from '@testing-library/react';

describe('usageTab', () => {
    it('renders the usageTab component when use is provided', async () => {
        const use = "Ujwal roxx";
        const exampleContent = [{
            url: "https://www.gem5.org",
            content: "def issue(numbers):\n Resource(\"scope\")",
            tested: false,
        }];
        const id = "scope"
        act(() => {
            render(<UsageTab use={use} exampleContent={exampleContent} id={id}/>);
        });
        await waitFor(() => expect(screen.getByText(/Ujwal/i)).toBeInTheDocument());
    });

    it('renders the usageTab component when use is not provided', async () => {
        const use = null;
        const exampleContent = [{
            url: "https://www.gem5.org",
            content: "def issue(numbers):\n Resource(\"scope\")",
            tested: false,
        }];
        const id = "scope"
        act(() => {
            render(<UsageTab use={use} exampleContent={exampleContent} id={id}/>);
        });
        await waitFor(() => expect(screen.getByText(/scope/i)).toBeInTheDocument());
    });
});