import Category from "@/pages/category";
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import schema from "../../schema.json";
import config from "../../../gem5.config.json"

const originalEnv = process.env;

jest.mock('../../../pages/category/workload.md', () =>
    Promise.resolve("This is test workload")
);

describe('Category component', () => {
    beforeEach(() => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            BASE_PATH: '',
            SOURCES: {
                "db1": {
                    url: "resources.json",
                    isMongo: false,
                }
            },
            TABS: config.ui.tabs,
            SCHEMA: schema,
        };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('renders without crashing', async () => {
        act(() => {
            render(<Category />);
        });
        await waitFor(() => {
            const categoryTitle = screen.getByText('Categories');
            expect(categoryTitle).toBeInTheDocument();
            let cards = screen.queryAllByLabelText('card');
            expect(cards).toHaveLength(14);
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