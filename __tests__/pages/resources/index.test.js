import Resources from "@/pages/resources";
import { render, screen, act, fireEvent } from "@testing-library/react";
import resources from "../../../public/resources.json";

global.fetch = jest.fn((url) => {
    if (url.includes("data.mongodb-api")) {
        return Promise.resolve({
            json: () => Promise.resolve({
                'documents': [
                    {
                        "category": ["simpoint", "file"],
                        "id": "batman",
                        "architecture": ["X86", "ARM", null],
                        "tags": [],
                        "resource_version": "1.0.0",
                        "gem5_versions": ["22.0"],
                        "database": "db1",
                    },
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

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/resources",
            pathname: "",
            query: {},
            asPath: "",
        };
    },
}));

const originalEnv = process.env;

describe("Resources component", () => {
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

    test("renders the resources page", async () => {
        await act(async () => {
            render(<Resources />);
        });
        const search = screen.getByText("batman");
        expect(search).toBeInTheDocument();
    });
});