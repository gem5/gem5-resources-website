import getToken from "./getToken";

/**
 * @helper
 * @async
 * @description Gets the filters from the MongoDB database. It gets the unique values for columns.
 * @returns {json} A json object with the filters.
*/
export default async function getFiltersMongoDB() {
    let accessToken = await getToken();
    // get all distinct categories from resources
    const res = await fetch(`${process.env.MONGODB_URI}/action/aggregate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'api-key': 'pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo',
            'Access-Control-Request-Headers': '*',
            "Authorization": "Bearer " + accessToken,
            // 'origin': 'https://gem5vision.github.io',
        },
        body: JSON.stringify({
            "dataSource": "gem5-vision",
            "database": "gem5-vision",
            "collection": process.env.COLLECTION,
            "pipeline": [
                {
                    "$addFields": {
                        "a": "$versions"
                    },
                },
                {
                    "$group": {
                        "_id": null,
                        "category": { "$addToSet": "$category" },
                        "architecture": { "$addToSet": "$architecture" },
                        "versions": { "$addToSet": "$a.version" },
                    },
                },
            ],
        })
    }).catch(err => console.log(err));
    let filters = await res.json();
    filters['documents'][0]['architecture'] = filters['documents'][0]['architecture'].filter(architecture => architecture != null);
    delete filters['documents'][0]['_id'];
    // get largest list of versions
    filters['documents'][0]['versions'] = filters['documents'][0]['versions'].reduce((a, b) => a.length > b.length ? a : b);

    filters['documents'][0]['versions'] = filters['documents'][0]['versions']
    filters['documents'][0]['category'].sort();
    filters['documents'][0]['architecture'].sort();
    filters['documents'][0]['versions'].sort().reverse();
    return filters['documents'][0];
}
