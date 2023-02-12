export async function getResource(id) {
    if (!id || id === 'test') {
        return { error: 'Resource not found' }
    }
    return { id: id, content: `This is sample content` }
}

export default async function handler(req, res) {
    // check if the request is a POST request
    console.log(req.body.id)
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
