import getFiltersJSON from "./json/getfilters";
import getFiltersMongoDB from "./mongodb/getfilters";

/**
 * @wrapper
 * @async
 * @description Gets the filters from the database.
 * @returns {json} A json object with the filters.
*/
export async function getFilters() {
    let filters;
    if (process.env.IS_MONGODB_ENABLED) {
        filters = await getFiltersMongoDB();
    } else {
        filters = await getFiltersJSON();
    }
    return filters;
}
