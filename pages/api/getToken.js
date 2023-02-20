export default async function getToken() {
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
    return accessToken;
}