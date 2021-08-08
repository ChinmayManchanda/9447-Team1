'use strict';
const AWS = require('aws-sdk');
const url = require('url');
const https = require('https');

const webHookUrl = process.env['webHookUrl'];
const slackChannel = process.env.slackChannel;

function postMessage(message, callback) {
const body = JSON.stringify(message);
const options = url.parse(webHookUrl);
options.method = 'POST';
options.headers = {
'Content-Type': 'application/json',
'Content-Length': Buffer.byteLength(body),
};

const postReq = https.request(options, (res) => {
const chunks = [];
res.setEncoding('utf8');
res.on('data', (chunk) => chunks.push(chunk));
res.on('end', () => {
if (callback) {
callback({
body: chunks.join(''),
statusCode: res.statusCode,
statusMessage: res.statusMessage,
});
}
});
return res;
});

postReq.write(body);
postReq.end();
}

function processEvent(event, callback) {
const message = event;
const consoleUrl = `https://console.aws.amazon.com/macie`;
const finding = message.detail.classificationDetails.result.sensitiveData[0].category;
const findingDescription = message.detail.description;;
const findingTime = message.detail.updatedAt;
const findingTimeEpoch = Math.floor(new Date(findingTime) / 1000);
const account =  message.detail.accountId;
const region =  message.detail.region;
const type = message.detail.type;
const jobId = message.detail.classificationDetails.jobId;
const lastSeen = `<!date^${findingTimeEpoch}^{date} at {time} | ${findingTime}>`;
var color = '#7CD197';
var severity = message.detail.severity.description;

const attachment = [{
"fallback": finding + ` - ${consoleUrl}/home?region=` + `${region}#findings?tab=job&search=classificationDetails.jobId%3D${jobId}`,
"pretext": `*AWS Macie finding in ${region} for Acct: ${account}*`,
"title": `${finding}`,
"title_link": `${consoleUrl}/home?region=` + `${region}#findings?tab=job&search=classificationDetails.jobId%3D${jobId}`,

"text": `${findingDescription}`,
"fields": [
{"title": "Severity","value": `${severity}`, "short": true},
{"title": "Region","value": `${region}`,"short": true},
{"title": "Resource Type","value": `${type}`,"short": true},
{"title": "Last Seen","value": `${lastSeen}`, "short": true}
],
"mrkdwn_in": ["pretext"],
"color": color
}];

const slackMessage = {
channel: slackChannel,
text : '',
attachments : attachment,
username: 'Macie',
'mrkdwn': true,
};

postMessage(slackMessage, (response) => {
if (response.statusCode < 400) {
console.info('Message posted successfully');
callback(null);
} else if (response.statusCode < 500) {
console.error(`Error posting message to Slack API: ${response.statusCode} - ${response.statusMessage}`);
callback(null);
} else {
callback(`Server error when processing message: ${response.statusCode} - ${response.statusMessage}`);
}
});
}
exports.handler = (event, context, callback) => {
        processEvent(event, callback);
};
