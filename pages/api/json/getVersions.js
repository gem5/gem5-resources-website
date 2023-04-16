import fetchResourcesJSON from "./resources";
import compareVersions from "../compareVersions";

export default async function getVersionsJSON(id, database) {
    const resources = await fetchResourcesJSON(database);
    // filter json file to find the resources that contain the query in their id
    let results = resources.filter(resource => resource.id === id);
    if (results.length === 0) {
        return { error: 'Resource not found' }
    }
    results.forEach((result) => {
        result.database = database;
    });
    results.sort((a, b) => -compareVersions(a.resource_version, b.resource_version));
    return results;
}