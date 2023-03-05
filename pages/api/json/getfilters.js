import fetchResourcesJSON from "./resources";

/**
 * @helper
 * @async
 * @description Gets the filters from the JSON file. It gets the unique values for columns.
 * @returns {json} A json object with the filters.
*/
export default async function getFiltersJSON() {
    const resources = await fetchResourcesJSON();
    // get unique categories from resources
    let categories = [...new Set(resources.map(resource => resource.category))];
    let architectures = [...new Set(resources.map(resource => resource.architecture))];
    // remove null values
    architectures = architectures.filter(architecture => architecture != null);
    
    let versions = [];
    for (let i = 0; i < resources.length; i++) {
        for (let j = 0; j < resources[i].versions.length; j++) {
            if (!versions.includes(resources[i].versions[j].version)) {
                versions.push(resources[i].versions[j].version);
            }
        }
    }

    return {
        category: categories,
        architecture: architectures,
        versions: versions
    };
}
