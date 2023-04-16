import getVersionsJSON from "./json/getVersions";
import getVersionsMongoDB from "./mongodb/getVersions";

export default async function getVersions(id, database) {
    if (process.env.PRIVATE_RESOURCES[database].isMongo) {
        return await getVersionsMongoDB(id, database);
    }
    else {
        return await getVersionsJSON(id, database);
    }
}