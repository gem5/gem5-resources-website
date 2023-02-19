export async function fetchResourcesMongo() {
    return fetch('https://us-west-2.aws.data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1/action/find', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.MONGODB_API_KEY,
        },
        body: JSON.stringify({
            "dataSource": "gem5-vision",
            "database": "gem5-vision",
            "collection": "resources",
        })
    }).then(res => res.json())
}

export async function fetchResources() {
    return fetch('https://raw.githubusercontent.com/Gem5Vision/json-to-mongodb/main/resources.json')
        .then(res => res.json())
}

export default async function handler(req, res) {
    const resources = await fetchResourcesMongo();

    res.status(200).json(resources);
}