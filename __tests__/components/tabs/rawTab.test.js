import RawTab from "@/components/tabs/rawTab";
import { act, render, screen, waitFor } from '@testing-library/react';

describe('RawTab', () => {
    it('renders the RawTab component', async () => {
        const resource = { foo: 'bar' };
        act(() => {
            render(<RawTab resource={resource} />);
        });
        await waitFor(() => expect(screen.getByText(/foo/i)).toBeInTheDocument());
    });
});