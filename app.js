const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');
const {google} = require('googleapis');

dotenv.config();

const app = express();

app.use(cors());

const oAuthClient = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	'http://127.0.0.1:8000/api/user/info'
);

const getGoogleUrl = () => {
	 const scopes = [
     	'https://www.googleapis.com/auth/userinfo.profile',
      	'https://www.googleapis.com/auth/userinfo.email'
    ];
    return oAuthClient.generateAuthUrl({
    	scope : scopes,
    	access_type: 'online'
    });
}

const oauthroute =  (req,res) => {
	const url = getGoogleUrl();
	res.redirect(url);
}

const succussroute = async (req,res) => {
	const tokens = (await oAuthClient.getToken(req.query.code)).tokens;
	oAuthClient.setCredentials(tokens);

	var oauth2 = google.oauth2({
 		 auth: oAuthClient,
 		 version: 'v2'
	});

	const {data} = await oauth2.userinfo.get();

	res.json({
		status : 'success',
		data
	});
}

app.get('/api/user',oauthroute);
app.get('/api/user/info',succussroute)

app.listen(8000,() => console.log('At port 8000'));