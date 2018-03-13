var util = require('util');
var fs = require('fs');
var readline = require('readline');
var { google } = require('googleapis');
var gal = require('google-auth-library');

var TOKEN_DIR =
  (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
  '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

function readFile(filename) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, { encoding: 'utf8' }, function(err, contents) {
      // check for errors
      if (err) {
        reject(err);
        return;
      }
      // the read succeeded
      resolve(contents);
    });
  });
}

function getPresentersFromGoogleSheet(auth, res) {
  // var Slack = require('slack-node');
  // webhookUri =
  //   'https://hooks.slack.com/services/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';

  // slack = new Slack();
  // slack.setWebhook(webhookUri);

  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get(
    {
      auth: auth,
      spreadsheetId: '1zTAf7sQNO15QKy5kRNAzVeVjS60_1-eMFnz-FLoHPvc',
      range: 'Sheet1!A:C',
    },
    function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var rows = response.data.values;
      if (rows.length == 0) {
        console.log('No data found.');
      } else {
        // let output_text = '';
        const output_array = [];
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          if (row[0] === 'Date') {
            continue;
          }
          output_array.push({
            date: row[0],
            type: row[1],
            name: row[2],
          });
        }

        const now = Date.now();
        const week = 7 * 24 * 60 * 60 * 1000;

        const newArray = output_array.filter(element => {
          let resultBool = true;
          const d = Date.parse(element.date);
          if (d - now < 0) {
            resultBool = false;
          } else if (d > now + week) {
            resultBool = false;
          }
          return resultBool;
        });

        console.log(JSON.stringify(output_array));
        console.log(JSON.stringify(newArray));
        output_text = JSON.stringify(newArray);

        res.json(newArray);
        // slack.webhook(
        //   {
        //     channel: '#labseminar',
        //     username: 'webhookbot',
        //     text: output_text,
        //   },
        //   function(err, response) {
        //     console.log(response);
        //   }
        // );
      }
    }
  );
}

function next_presenters(req, res) {
  var period = req.swagger.params.period.value || 1;

  let p1 = readFile('config/client_secret.json');
  let p2 = readFile(TOKEN_PATH);
  let p3 = Promise.all([p1, p2]);

  p3
    .then(function(values) {
      let credentials = JSON.parse(values[0]);
      let token = JSON.parse(values[1]);
      var clientId = credentials.installed.client_id;
      var clientSecret = credentials.installed.client_secret;
      var redirectUrl = credentials.installed.redirect_uris[0];
      var auth = new gal.GoogleAuth();
      var oauth2Client = new gal.OAuth2Client(
        clientId,
        clientSecret,
        redirectUrl
      );
      oauth2Client.credentials = token;
      return oauth2Client;
    })
    .then(function(oauth2Client) {
      return getPresentersFromGoogleSheet(oauth2Client, res);
    });
}

module.exports = {
  next_presenters: next_presenters,
};
