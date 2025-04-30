import getToken from "./getToken";

/**
 * @function getFilters
 * @async
 * @description This asynchronous function fetches distinct categories, architectures, and gem5 versions from MongoDB database
 * It takes in an access token, URL, data source, database, and collection as input parameters, and returns an object containing the
 * distinct categories, architectures, and gem5 versions sorted in ascending or descending order.
 * @param {string} accessToken - The access token for authentication.
 * @param {string} url - The URL of the data source.
 * @returns {Object} - An object containing the distinct categories, architectures, and gem5 versions sorted in ascending or descending order.
 */
async function getFilters(accessToken, url) {
    // get all distinct categories from resources
    try {
        const res = await fetch(`${url}/filters`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'x-functions-key': accessToken, // Using API token as x-functions-key for Azure Functions
            },
        });

        // Check if status is not 200
        if (res.status !== 200) {
            console.log("Error: " + res.status);
            return {
                "category": [],
                "architecture": [],
                "gem5_versions": []
            };
        }

        // Parse the response
        const filters = await res.json();
        
        // Return the filters directly since the API already formats them correctly
        return filters;
    } catch (err) {
        console.log("Error fetching filters:", err);
        return {
            "category": [],
            "architecture": [],
            "gem5_versions": []
        };
    }
}

/**
 * @function getFiltersMongoDB
 * @async
 * @description Gets the filters from the MongoDB database. It gets the unique values for columns.
 * @returns {json} A json object with the filters.
*/
export default async function getFiltersMongoDB(database) {
    let privateResources = process.env.SOURCES;
    let privateResource = privateResources[database];
    let privateAccessToken = await getToken(database);
    let privateFilters = await getFilters(privateAccessToken, privateResource.url);
    return privateFilters;
}
