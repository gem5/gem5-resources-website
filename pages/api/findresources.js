import resources from '/public/resources.json';

export async function getResources(query) {
    // filter json file to find the resources that contain the query in their id
    let results = resources['resources'].filter(resource => resource.id.includes(query));
    return results;
}

export default async function handler(req, res) {
    // res.status(200).json(resources);
    // find the resources that contain the query in their id
    let query = req.query.q;
    let results = await getResources(query);
    res.status(200).json(results);
}
