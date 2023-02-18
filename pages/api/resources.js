export async function fetchResources() {
    return fetch('https://raw.githubusercontent.com/Gem5Vision/json-to-mongodb/main/resources.json')
        .then(res => res.json())
}

export default async function handler(req, res) {
    const resources = await fetchResources();

    res.status(200).json(resources);
}