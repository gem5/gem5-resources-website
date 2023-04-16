import getToken from "./getToken";

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
 * @helper
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
