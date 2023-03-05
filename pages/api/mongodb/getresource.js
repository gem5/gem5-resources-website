import getToken from "./getToken";

/**
 * @helper
 * @async
 * @description Fetches a resource from the MongoDB database.
 * @param {string} id The id of the resource to be fetched.
 * @returns {json} The resource in JSON format.
*/
export default async function getResourceMongoDB(id) {
    const token = await getToken();
    const res = await fetch('https://us-west-2.aws.data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1/action/findOne', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'api-key': 'pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo',
            'Access-Control-Request-Headers': '*',
            // 'origin': 'https://gem5vision.github.io',
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
            "dataSource": "gem5-vision",
            "database": "gem5-vision",
            "collection": "resources",
            "filter": {
                "id": id
            }
        })
    }).catch(err => console.log(err));
    const resource = await res.json();
    const dependendWorkloads = await fetch("https://us-west-2.aws.data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1/action/aggregate", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
            "dataSource": "gem5-vision",
            "database": "gem5-vision",
            "collection": "resources",
            "pipeline": [
                {
                    "$addFields": {
                        "resources": {
                            "$objectToArray": "$resources"
                        }
                    }
                },
                {
                    "$unwind": "$resources"
                },
                {
                    "$match": {
                        "resources.v": id
                    }
                },
                {
                    "$group": {
                        "_id": "$id",

                    }
                }
            ]
        })
    }).catch(err => console.log(err));
    const workloads = await dependendWorkloads.json();
    if (resource['document'] === null) {
        return { error: 'Resource not found' }
    }
    resource['document'].workloads = Object.values(workloads['documents']).map(workload => workload['_id']);
    return resource['document']
}