import getFiltersJSON from "./json/getFilters";
import getFiltersMongoDB from "./mongodb/getFilters";

/**
 * @wrapper
 * @async
 * @description Gets the filters from every database.
 * @returns {json} A json object with the filters.
*/
export async function getFilters() {
    let filters = {
        "category": [],
        "architecture": [],
        "gem5_versions": [],
    };
    let privateResources = process.env.SOURCES;
    for (let resource in privateResources) {
        let privateResource = privateResources[resource];
        let privateFilters;
        if (privateResource.isMongo) {
            privateFilters = await getFiltersMongoDB(resource);
        } else {
            privateFilters = await getFiltersJSON(resource);
        }
        privateFilters['category'].forEach((category) => {
            if (!filters['category'].includes(category)) {
                filters['category'].push(category);
            }
        });
        privateFilters['architecture'].forEach((architecture) => {
            if (!filters['architecture'].includes(architecture)) {
                filters['architecture'].push(architecture);
            }
        });
        privateFilters['gem5_versions'].forEach((version) => {
            if (!filters['gem5_versions'].includes(version)) {
                filters['gem5_versions'].push(version);
            }
        });
    }
    filters['category'].sort();
    filters['architecture'].sort();
    filters['gem5_versions'].sort().reverse();

    // get all keys from process.env.SOURCES
    let keys = Object.keys(process.env.SOURCES);
    if (keys.length > 0) {
        filters['database'] = keys;
    }
    return filters;
}
