import getToken from "./getToken";
import compareVersions from "../compareVersions";


async function getVersionsByID(token, url, dataSource, database, collection, id) {
    const res = await fetch(`${url}/action/find`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'api-key': 'pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo',
            'Access-Control-Request-Headers': '*',
            // 'origin': 'https://gem5vision.github.io',
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
            "dataSource": dataSource,
            "database": database,
            "collection": collection,
            "filter": {
                "id": id
            }
        })
    }).catch(err => console.log(err));
    let resource = await res.json();
    if (resource['documents'] === null) {
        return { error: 'Resource not found' }
    }
    resource = resource['documents'].sort((a, b) => -compareVersions(a.resource_version, b.resource_version));

    return resource;
}

/**
 * @helper
 * @async
 * @description Fetches a resource from the MongoDB database.
 * @param {string} id The id of the resource to be fetched.
 * @returns {json} The resource in JSON format.
*/
export default async function getVersionsMongoDB(id, database = null) {
    if (!database) {
        /* const token = await getToken();
        const resource = await getResourceByID(token, process.env.MONGODB_MAIN.url, process.env.MONGODB_MAIN.dataSource, process.env.MONGODB_MAIN.database, process.env.MONGODB_MAIN.collection, id);
        return resource; */
        database = Object.keys(process.env.PRIVATE_RESOURCES)[0];
    }
    const token = await getToken(database);
    let privateResources = process.env.PRIVATE_RESOURCES[database];
    const resource = await getVersionsByID(token, privateResources.url, privateResources.dataSource, privateResources.database, privateResources.collection, id);
    resource.forEach(res => {
        res['database'] = database;
    });
    return resource;
}