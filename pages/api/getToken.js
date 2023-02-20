let prevToken = null;

export default async function getToken() {
    if (prevToken) {
        return prevToken;
    }
    let token = await fetch('https://realm.mongodb.com/api/client/v2.0/app/data-ejhjf/auth/providers/api-key/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "key": process.env.MONGODB_API_KEY
        })
    }).catch(err => console.log(err));
    let tokenJson = await token.json();
    let accessToken = tokenJson['access_token'];
    prevToken = accessToken;
    console.log(accessToken);
    return accessToken;
}