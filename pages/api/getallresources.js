import resources from '/public/resources.json';

export default async function handler(req, res) {
    res.status(200).json(resources);
}
