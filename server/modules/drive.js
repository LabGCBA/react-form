/*jshint esnext: true */

'use strict';

const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const jsonfile = require('jsonfile');
const path = require('path');
const config = jsonfile.readFileSync(path.join(__dirname, '..', 'config', 'credentials.json'));
const token = jsonfile.readFileSync(path.join(__dirname, '..', 'config', 'token.json'));
const oauth2Client = new OAuth2(config.web.client_id, config.web.client_secret, config.web.redirect_uris[0]);

google.options({ auth: oauth2Client });

oauth2Client.setCredentials({  
  access_token: token.access_token,
  token_type: token.token_type,
  refresh_token: token.refresh_token,
  expiry_date: token.expiry_date
});

module.exports = oauth2Client;