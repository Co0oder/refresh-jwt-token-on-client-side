const app = require('express')();
const cors = require('cors');
const jwt_decode = require('jwt-decode');

const tokenPart1 = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9`;
const tokenPart3 = `EE259kMCJYDjt8YFKP3mOUgkfQIBy9N9HzT-hYD9ZHhb7NJrGMMwqHShevnUpdR1qU8hgWXLE2p87Pbzq7ZCqw`;
const tokenData = {
    exp: 1614347178,
    email: "bogdan@gmail.com",
    aud: "https://localhost",
    iat: 1614347178,
    role: [
        "Admin"
    ]
}
app.use(cors());
app.post('/login', (req, res) => {
    const data = generateToken();
    res.json({
        value: {
            accessToken: `${tokenPart1}.${data.toString('base64')}.${tokenPart3}`,
            refreshToken: 'secret.refresh.token',
        },
        errors: []
    })
})


app.get('/secret', (req,res) => {
    const {authorization} = req.headers;
    if(!authorization){
        res.status(401).json({status: 401});
        return;
    }
    const decoded = jwt_decode(authorization.replace('Bearer ', ''));
    if(!(new Date(decoded.exp * 1000) >= new Date())){
        res.status(401).json({status: 401});
        return;
    }
    res.json({secret: `${new Date(decoded.exp * 1000).toLocaleTimeString()} | ${new Date().toLocaleTimeString()}`})

})

app.post('/refresh', (req,res) => {
    const {refreshToken} = req.query;
    console.log(`POST['/refresh'] params: [`, refreshToken, ']');
    if(refreshToken !== 'secret.refresh.token'){
        res.status(401).json({status: 401});
        return;
    }
    const data = generateToken();
    res.json({value: {
        accessToken: `${tokenPart1}.${data.toString('base64')}.${tokenPart3}`
    }});
})

function generateToken() {
    const date = new Date(); 
    const now_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()) / 1000 + 50;
    tokenData.exp =  now_utc;
    return new Buffer.from(JSON.stringify(tokenData));
}
app.listen(3000);

