import resources from '/public/resources.json';

export async function getFilters() {
    // get unique categories from resources
    let categories = [...new Set(resources['resources'].map(resource => resource.category))];
    // get unique groups from resources and remove null values
    let groups = [...new Set(resources['resources'].map(resource => resource.group))].filter(group => group != null);
    // get unique architectures from resources
    let architectures = [...new Set(resources['resources'].map(resource => resource.architecture))];
    return {
        category: categories,
        group: groups,
        architecture: architectures,
    };
}

export default async function handler(req, res) {
    let results = await getFilters();
    res.status(200).json(results);
}
