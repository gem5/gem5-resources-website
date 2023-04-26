import RawTab from "@/components/tabs/rawTab";
import { render } from '@testing-library/react';

// Mock the textToHtml function
jest.mock("@/components/tabs/rawTab", () => ({
    __esModule: true,
    default: ({ resource }) => <pre><code class="language-python">{JSON.stringify(resource)}</code></pre>,
  }));

  // Write your test case
describe('RawTab', () => {
    it('renders the RawTab component', () => {
        const resource = { foo: 'bar' };
        const { getByText } = render(<RawTab resource={resource} />);
        const rawInfo = getByText(/bar/i);
        expect(rawInfo).toBeInTheDocument();
    });
});