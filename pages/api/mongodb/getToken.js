
async function getAccessToken(url, key) {
    let token = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
        },
        body: JSON.stringify({
            "key": key
        })
    }).catch(err => console.log(err));
    let tokenJson = await token.json();
    return {
        accessToken: tokenJson['access_token'],
        expires: Date.now() + 30 * 60 * 1000,
        refreshToken: tokenJson['refresh_token']
    }
}

/**
 * @function
 * @async
 * @description Retrieves an access token by sending an API key to the Realm API to authenticate annonymously.
 * @returns {string} The access token string.
*/
export default async function getToken(key = null) {
    // Send API key to Realm API to retrieve access token
    if (!key) {
        key = Object.keys(process.env.PRIVATE_RESOURCES)[0];
    }
    let privateENV = process.env.PRIVATE_RESOURCES[key];
    let token = sessionStorage.getItem('token');
    if (token) {
        token = JSON.parse(token);
    } else {
        token = {};
    }
    if (token && token[key] && token[key].expires >= Date.now()) {
        return token[key].accessToken;
    }
    else {
        token[key] = await getAccessToken(`https://realm.mongodb.com/api/client/v2.0/app/${privateENV.name}/auth/providers/api-key/login`, privateENV.apiKey);
        sessionStorage.setItem('token', JSON.stringify(token));
        return token[key].accessToken;
    }
}