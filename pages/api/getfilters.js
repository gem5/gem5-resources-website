import { fetchResources } from "./resources";
import { getToken } from "./getToken";

export async function getFiltersMongoDB() {
    let accessToken = await getToken();
    // get all distinct categories from resources
    const res = await fetch('https://us-west-2.aws.data.mongodb-api.com/app/data-ejhjf/endpoint/data/v1/action/aggregate', {
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
            "collection": "resources",
            "pipeline": [
                {
                    "$group": {
                        "_id": null,
                        "category": { "$addToSet": "$category" },
                        "architecture": { "$addToSet": "$architecture" },
                        "gem5_version": { "$addToSet": "$gem5_version" },
                    },
                },
            ],
        })
    }).catch(err => console.log(err));
    let filters = await res.json();
    filters['documents'][0]['architecture'] = filters['documents'][0]['architecture'].filter(architecture => architecture != null);
    delete filters['documents'][0]['_id'];
    // sort categories, architectures, and gem5_versions alphabetically
    filters['documents'][0]['category'].sort();
    filters['documents'][0]['architecture'].sort();
    filters['documents'][0]['gem5_version'].sort();
    return filters['documents'][0];
}

export async function getFilters() {
    const resources = await fetchResources();
    // get unique categories from resources
    let categories = [...new Set(resources['resources'].map(resource => resource.category))];
    // get unique groups from resources and remove null values
    // let groups = [...new Set(resources['resources'].map(resource => resource.group))].filter(group => group != null);
    // get unique architectures from resources
    let architectures = [...new Set(resources['resources'].map(resource => resource.architecture))];
    // get zipped from resources
    // let zippeds = [...new Set(resources['resources'].map(resource => String(resource.is_zipped)))].filter(zipped => zipped != "null");
    // get gem5_version from resources
    let gem5_versions = [...new Set(resources['resources'].map(resource => resource.gem5_version))].filter(gem5_version => gem5_version != null);
    return {
        category: categories,
        // group: groups,
        architecture: architectures,
        // is_zipped : zippeds,
        gem5_version: gem5_versions
    };
}

export default async function handler(req, res) {
    let results = await getFiltersMongoDB();
    res.status(200).json(results);
}
