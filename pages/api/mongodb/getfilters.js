import getToken from "./getToken";

/**
 * @function getFilters
 * @async
 * @description This asynchronous function fetches distinct categories, architectures, and gem5 versions from a specified data source using MongoDB aggregation pipeline.
 * It takes in an access token, URL, data source, database, and collection as input parameters, and returns an object containing the
 * distinct categories, architectures, and gem5 versions sorted in ascending or descending order.
 * @param {string} accessToken - The access token for authentication.
 * @param {string} url - The URL of the data source.
 * @param {string} dataSource - The name of the data source.
 * @param {string} database - The name of the database.
 * @param {string} collection - The name of the collection.
 * @returns {Object} - An object containing the distinct categories, architectures, and gem5 versions sorted in ascending or descending order.
 */
async function getFilters(accessToken, url, dataSource, database, collection) {
    // get all distinct categories from resources
    const res = await fetch(`${url}/action/aggregate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            "Authorization": "Bearer " + accessToken,
        },
        body: JSON.stringify({
            "dataSource": dataSource,
            "database": database,
            "collection": collection,
            "pipeline": [
                {
                    "$unwind": "$gem5_versions"
                },
                {
                    "$group": {
                        "_id": null,
                        "category": { "$addToSet": "$category" },
                        "architecture": { "$addToSet": "$architecture" },
                        "gem5_versions": { "$addToSet": "$gem5_versions" }
                    }
                }
            ]
        })
    }).catch(err => console.log(err));
    let filters = await res.json();
    filters['documents'][0]['architecture'] = filters['documents'][0]['architecture'].filter(architecture => architecture != null);
    delete filters['documents'][0]['_id'];

    filters['documents'][0]['gem5_versions'] = filters['documents'][0]['gem5_versions']
    filters['documents'][0]['category'].sort();
    filters['documents'][0]['architecture'].sort();
    filters['documents'][0]['gem5_versions'].sort().reverse();
    return filters['documents'][0];
}

/**
 * @function getFiltersMongoDB
 * @async
 * @description Gets the filters from the MongoDB database. It gets the unique values for columns.
 * @returns {json} A json object with the filters.
*/
export default async function getFiltersMongoDB(database) {
    let privateResources = process.env.PRIVATE_RESOURCES
    let privateResource = privateResources[database];
    let privateAccessToken = await getToken(database);
    let privateFilters = await getFilters(privateAccessToken, privateResource.url, privateResource.dataSource, privateResource.database, privateResource.collection);
    return privateFilters;
}
