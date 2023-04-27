import VersionTab from "@/components/tabs/versionTab";
import { act, render, screen, waitFor, within } from '@testing-library/react';
import resources from "../../../public/resources.json"

global.fetch = jest.fn((url) => {
    if (url.includes("data.mongodb-api")) {
        return Promise.resolve({
            json: () => Promise.resolve({
                'documents': [
                    {
                        "category": "simpoint",
                        "id": "batman",
                        "architecture": "X86",
                        "tags": [],
                        "resource_version": "1.0.0",
                        "database": "db1"
                    }
                ]
            }),
        })
    }

    if (url.includes("resources.json")) {
        return Promise.resolve({
            json: () => Promise.resolve(resources),
        })
    }

    if (url.includes("realm.mongodb.com")) {
        return Promise.resolve({
            json: () => Promise.resolve({
                "access_token": ""
            }),
        })
    }

    return Promise.resolve({
        json: () => Promise.resolve({
            "error": "Resource not found"
        }),
    })
});

const originalEnv = process.env;

describe('VersionTab', () => {
    beforeEach(() => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
            BASE_PATH: '',
            PRIVATE_RESOURCES: {
                "db1": {
                    url: "resources.json",
                    isMongo: false,
                }
            }
        };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('renders the VersionTab component', async () => {
        act(() => {
            render(<VersionTab id="this-is-a-test-resource" database="db1" />);
        });
        await waitFor(() =>
            expect(screen.getByText(/1.0.0/i)).toBeInTheDocument());
        expect(screen.getByText(/1.1.0/i)).toBeInTheDocument();
        expect(screen.getByText(/2.0.0/i)).toBeInTheDocument();
        const row = screen.getByRole('row', { name: /2\.0\.0 13\.5 kb 23\.1/i });
        expect(within(row).getByRole('cell', { name: /13\.5 kb/i })).toBeInTheDocument();
    });
});