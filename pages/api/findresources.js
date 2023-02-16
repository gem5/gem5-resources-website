import resources from '/public/resources.json';

export async function getResources(queryObject) {
    const query = queryObject.query;

    // do search like
    console.log(query);
    // filter json file to find the resources that contain the query in their id
    let results = resources['resources'].filter(resource => resource.id.toLowerCase().includes(query.toLowerCase()) || resource.description.toLowerCase().includes(query.toLowerCase()));
    // filter based on queryObject filters
    console.log(queryObject)
    for (let filter in queryObject) {
        if (filter !== "query") {
            results = results.filter(resource => queryObject[filter].includes(resource[filter]));
        }
    }
    return results;
}

export default async function handler(req, res) {
    // res.status(200).json(resources);
    // find the resources that contain the query in their id
    let query = req.query.q;
    let results = await getResources(query);
    res.status(200).json(results);
}
