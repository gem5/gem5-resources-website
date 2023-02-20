let prevToken = null;

export default async function getToken() {
    if (prevToken) {
        return prevToken;
    }
    let token = await fetch('https://realm.mongodb.com/api/client/v2.0/app/data-ejhjf/auth/providers/api-key/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
        },
        body: JSON.stringify({
            "key": process.env.MONGODB_API_KEY
        })
    }).catch(err => console.log(err));
    console.log('Token res: ', token);
    let tokenJson = await token.json();
    let accessToken = tokenJson['access_token'];
    prevToken = accessToken;
    console.log('Token: ', accessToken);
    return accessToken;
}