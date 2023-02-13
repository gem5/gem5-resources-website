export async function getResource(id) {
    // sleep for 1 second to simulate a slow API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    if (!id || id === 'test') {
        return { error: 'Resource not found' }
    }
    return {
        "category": "disk image",
        "id": id,
        "description": "A RISCV disk image, based on busybox, to be used with the LupvBoard. Should be used with the 'riscv-lupio-linux-kernel' kernel resource.",
        "date_published": "2021-05-01",
        "author": "Bobby R. Bruce",
        "function": null,
        "resources": null,
        "additional_params": null,
        "architecture": "RISCV",
        "is_zipped": true,
        "md5sum": "e5bee8a31f45f4803f87c0d781553ccc",
        "source": "src/lupv",
        "is_tar_archive": null,
        "download_url": "{url_base}/images/riscv/busybox/riscv-lupio-busybox.img.gz",
        "additional_metadata": {
            "root_partition": "1"
        },
        "group": null,
        "name": "riscv lupio busybox img",
        "gem5_version": "22.1",
        "downloads": 0,
        "example_url": null,
        "documentation_url": null,
        "github_url": null
    }
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
