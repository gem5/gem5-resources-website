export async function getResource(id) {
    // sleep for 1 second to simulate a slow API call
    await new Promise(resolve => setTimeout(resolve, 2000))
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
