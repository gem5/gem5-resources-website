import resources from '/public/resources.json';

export async function getResource(id) {
    // filter json file to find the resources that contain the query in their id
    let results = resources['resources'].filter(resource => resource.id === id);
    if (results.length === 0) {
        return { error: 'Resource not found' }
    }
    let workloads = resources['resources'].filter(resource => {
        if (resource.resources) {
            return Object.keys(resource.resources).map((key) => {
                return resource.resources[key]
            }).includes(id)
        }
    })
    if (workloads.length === 0) {
        workloads = null
    } else {
        results[0].workloads = workloads;
    }
    return results[0];
}

export default async function handler(req, res) {
    // check if the request is a POST request
    if (req.method === 'POST') {
        let data = await getResource(req.body.id)
        if (data.error) {
            return res.status(400).json({ error: data.error })
        }
        return res.status(200).json(data)
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' })
    }
}
