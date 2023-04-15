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
    console.log(filters);
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
export default async function getFiltersMongoDB() {
    // let accessToken = await getToken();
    // let filters = await getFilters(accessToken, process.env.MONGODB_MAIN.url, process.env.MONGODB_MAIN.dataSource, process.env.MONGODB_MAIN.database, process.env.MONGODB_MAIN.collection);
    let filters = {
        "category": [],
        "architecture": [],
        "gem5_versions": [],
    };
    let privateResources = process.env.PRIVATE_RESOURCES
    for (let resource in privateResources) {
        let privateResource = privateResources[resource];
        let privateAccessToken = await getToken(resource);
        let privateFilters = await getFilters(privateAccessToken, privateResource.url, privateResource.dataSource, privateResource.database, privateResource.collection);
        privateFilters['category'].forEach((category) => {
            if (!filters['category'].includes(category)) {
                filters['category'].push(category);
            }
        });
        privateFilters['architecture'].forEach((architecture) => {
            if (!filters['architecture'].includes(architecture)) {
                filters['architecture'].push(architecture);
            }
        });
        privateFilters['gem5_versions'].forEach((version) => {
            if (!filters['gem5_versions'].includes(version)) {
                filters['gem5_versions'].push(version);
            }
        });
    }
    filters['category'].sort();
    filters['architecture'].sort();
    filters['gem5_versions'].sort().reverse();

    // get all keys from process.env.PRIVATE_RESOURCES
    let keys = Object.keys(process.env.PRIVATE_RESOURCES);
    if (keys.length > 0) {
        filters['database'] = keys;
    }

    return filters;
}
