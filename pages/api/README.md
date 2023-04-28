# API Documentation for Static Website

This is a collection of JavaScript files that function as the API for resource management. The API provides functions for searching, filtering, and fetching resources from a database. The implementation of the database can be either MongoDB or JSON, depending on the value of the `process.env.RESOURCES.isMongo` environment variable.

## Files

The API is composed of the following files:

- `findresources.js`: This file contains a wrapper function that invokes the `getResources` function for either MongoDB or JSON, depending on the value of `isMongo` of the Resource config. The `getResources` function is used for searching resources based on a query. It also takes in other parameters like `currentPage` and `nPerPage` which aid in pagination.

- `getfilters.js`: This file contains a wrapper function that invokes the `getFilters` function for either MongoDB or JSON, depending on the value of `isMongo` of the Resource config. The `getFilters` function is used for fetching the filtering options present on the website dynamically.

- `getresource.js`: This file contains a wrapper function that invokes the `getResource` function for either MongoDB or JSON, depending on the value of `isMongo` of the Resource config. The `getResource` function is used for finding a resource by its exact ID, and throws an error if the database is invalid.

- `getVersions.js`: The `getVersions` function retrieves versions of a resource with the given ID from a specified database. It determines the type of database by the value of `isMongo` property in the environment variable. If `isMongo` is true, it calls the `getVersionsMongoDB` function to fetch versions from a MongoDB database. Otherwise, it calls the `getVersionsJSON` function to fetch versions from a JSON file.

- `getTabs.js`: The `getTabs` function takes in a JSON object res and returns an object with information about the required, optional, and metadata fields for a specific category. The function first fetches a schema from a specified URL, then recursively calls a helper function getRequiredFields() to determine which fields are required and which are optional for the given category. It then adds the required and optional fields from the schema to the respective arrays, removes any duplicate fields, removes any fields that are not in the resource, and adds the content of the fields to the corresponding objects in the arrays. Finally, it uses a tabs object to determine which fields should be in which tab and returns the required, optional, and metadata fields grouped accordingly.

## Functions

<dl>
<dt><a href="#getFilters">getFilters()</a> ⇒ <code>json</code></dt>
<dd><p>Gets the filters from the database.</p>
</dd>
<dt><a href="#getResource">getResource(id)</a> ⇒ <code>json</code></dt>
<dd><p>Fetches a resource from the MongoDB database or JSON file.</p>
</dd>
<dt><a href="#fetchResources">fetchResources()</a> ⇒ <code>Promise</code></dt>
<dd><p>Fetches resources either from a MongoDB database or from a JSON file based on the value of the IS_MONGODB_ENABLED environment variable.</p>
</dd>
<dt><a href="#getVersions">getVersions(id, database)</a> ⇒ <code>json</code></dt>
<dd><p>Returns an object with information about the versions of a resource with the given ID from a specified database.</p>
</dd>
<dt><a href="#getTabs">getTabs(res)</a> ⇒ <code>json</code></dt>
<dd><p>Returns an object with information about the required, optional, and metadata fields for a specific schema category.</p>
</dd>
</dl>

<a name="getResources"></a>

## getResources(queryObject, currentPage, pageSize) ⇒ <code>json</code>
![findresources.js](./docs/findresources.svg)
Wrapper function to fetch the resources based on the query object.

**Kind**: global function </br>
**Returns**: <code>json</code> - The resources in JSON format.</br>

| Param | Type | Description |
| --- | --- | --- |
| queryObject | <code>json</code> | The query object. |
| filters | <code>json</code> | The filters to be applied. |

<a name="getFilters"></a>

## getFilters() ⇒ <code>json</code>
![getfilters.js](./docs/getfilters.svg)
Gets the filters from the database.

**Kind**: global function </br>
**Returns**: <code>json</code> - A json object with the filters. </br>
<a name="getResource"></a>

## getResource(id) ⇒ <code>json</code>
![getresource.js](./docs/getresource.svg)
Fetches a resource from the MongoDB database or JSON file.

**Kind**: global function </br>
**Returns**: <code>json</code> - The resource in JSON format. </br>

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the resource to be fetched. |

<a name="fetchResources"></a>

## fetchResources() ⇒ `json`
![resources.js](./docs/resources.svg)
Fetches resources either from a MongoDB database or from a JSON file based on the value of the IS_MONGODB_ENABLED environment variable.

**Kind**: global function </br>
**Returns**: <code>json</code> - A JSON object containing all the resources. </br>

<a name="getVersions"></a>

## getVersions(id, database) ⇒ <code>json</code>
Returns an object with information about the versions of a resource with the given ID from a specified database.

**Kind**: global function </br>
**Returns**: <code>json</code> - The versions in JSON format. </br>

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the resource to be fetched. |
| database | <code>string</code> | The database of the resource from which the id should be fetched. |

<a name="getVersions"></a>

## getTabs(res) ⇒ <code>json</code>
Returns an object with information about the required, optional, and metadata fields for a specific category

**Kind**: global function </br>
**Returns**: <code>json</code> - Contains the required, optional and metadata tabs. </br>

| Param | Type | Description |
| --- | --- | --- |
| res | <code>string</code> | The config for where the schema properties should lie ("required", "optional" or "metadata") |
