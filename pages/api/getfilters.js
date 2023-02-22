import { fetchResources } from "./resources";
import getToken from "./getToken";

async function getFiltersMongoDB() {
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
                        "versions": { "$addToSet": "$versions" },
                    },
                },
            ],
        })
    }).catch(err => console.log(err));
    let filters = await res.json();
    filters['documents'][0]['architecture'] = filters['documents'][0]['architecture'].filter(architecture => architecture != null);
    delete filters['documents'][0]['_id'];
    // sort categories, architectures, and gem5_versions alphabetically
    console.log(filters['documents'][0]['versions']);
    // get the one with the most versions
    let maxVersions = 0;
    let maxVersionsIndex = 0;
    for (let i = 0; i < filters['documents'][0]['versions'].length; i++) {
        if (Object.keys(filters['documents'][0]['versions'][i]).length > maxVersions) {
            maxVersions = Object.keys(filters['documents'][0]['versions'][i]).length;
            maxVersionsIndex = i;
        }
    }
    filters['documents'][0]['versions'] = Object.keys(filters['documents'][0]['versions'][maxVersionsIndex]);
    filters['documents'][0]['category'].sort();
    filters['documents'][0]['architecture'].sort();
    filters['documents'][0]['versions'].sort();
    return filters['documents'][0];
}

async function getFiltersJSON() {
    const resources = await fetchResources();
    // get unique categories from resources
    let categories = [...new Set(resources.map(resource => resource.category))];
    // get unique groups from resources and remove null values
    // let groups = [...new Set(resources['resources'].map(resource => resource.group))].filter(group => group != null);
    // get unique architectures from resources
    let architectures = [...new Set(resources.map(resource => resource.architecture))];
    // get zipped from resources
    // let zippeds = [...new Set(resources['resources'].map(resource => String(resource.is_zipped)))].filter(zipped => zipped != "null");
    // get versions from resources
    let versions = [...new Set(resources.map(resource => resource.versions))];
    // this is a list of dictionaries, find a way to get the unique values
    versions = versions.map(version => {
        return Object.keys(version);
    });
    // merge the lists
    versions = [].concat.apply([], versions);
    return {
        category: categories,
        // group: groups,
        architecture: architectures,
        // is_zipped : zippeds,
        versions: versions
    };
}

export async function getFilters() {
    let filters;
    // if (process.env.IS_MONGODB_ENABLED === "true") {
    // filters = await getFiltersMongoDB();
    // } else {
    filters = await getFiltersJSON();
    // }
    return filters;
}

export default async function handler(req, res) {
    let results = await getFiltersMongoDB();
    res.status(200).json(results);
}
