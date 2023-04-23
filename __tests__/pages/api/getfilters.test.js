import { getFilters } from "@/pages/api/getfilters";

const originalEnv = process.env;

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([]),
    })
);

describe('getFilters', () => {
    beforeEach(() => {
        jest.resetModules();
        process.env = {
            ...originalEnv,
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

    test('returns empty object if no private resources are defined', async () => {
        // Arrange
        process.env.PRIVATE_RESOURCES = {};

        // Act
        const filters = await getFilters();

        // Assert
        expect(filters).toEqual({
            category: [],
            architecture: [],
            gem5_versions: [],
        });
    });
});



//   it('returns the correct filters', async () => {
//     // Mock the getFiltersMongoDB and getFiltersJSON functions
//     const getFiltersMongoDB = jest.fn().mockResolvedValue({
//       category: ['cat1', 'cat2'],
//       architecture: ['arch1', 'arch2'],
//       gem5_versions: ['v1', 'v2'],
//     });
//     const getFiltersJSON = jest.fn().mockResolvedValue({
//       category: ['cat2', 'cat3'],
//       architecture: ['arch2', 'arch3'],
//       gem5_versions: ['v2', 'v3'],
//     });

//     // Call the getFilters function and check the result
//     const result = await getFilters();

//     expect(result).toEqual({
//       category: ['cat1', 'cat2', 'cat3'],
//       architecture: ['arch1', 'arch2', 'arch3'],
//       gem5_versions: ['v3', 'v2', 'v1'],
//       database: ['resource1', 'resource2'],
//     });
//     expect(getFiltersMongoDB).toHaveBeenCalledTimes(1);
//     expect(getFiltersMongoDB).toHaveBeenCalledWith('resource1');
//     expect(getFiltersJSON).toHaveBeenCalledTimes(1);
//     expect(getFiltersJSON).toHaveBeenCalledWith('resource2');
//   });


// });
