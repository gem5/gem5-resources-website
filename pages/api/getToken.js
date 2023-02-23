/**
 * @function
 * @async
 * @description Retrieves an access token by sending an API key to the Realm API to authenticate annonymously.
 * @returns {string} The access token string.
*/
export default async function getToken() {
    // Send API key to Realm API to retrieve access token
    let token = await fetch('https://realm.mongodb.com/api/client/v2.0/app/data-ejhjf/auth/providers/api-key/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
        },
        body: JSON.stringify({
            "key": 'pKkhRJGJaQ3NdJyDt69u4GPGQTDUIhHlx4a3lrKUNx2hxuc8uba8NrP3IVRvlzlo'
        })
    }).catch(err => console.log(err));
    // Extract access token from response
    let tokenJson = await token.json();
    let accessToken = tokenJson['access_token'];
    // Log success/failure and return access token
    if (accessToken)
        console.log("Successfully got access token");
    else
        console.log("Failed to get access token");
    return accessToken;
}