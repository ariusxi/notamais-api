'use strict';
const config = require('../config');
const client = require('twilio')(config.paramsTwilio.apiKey, config.paramsTwilio.apiSecret, {accountSid: config.paramsTwilio.accountSid});

exports.send = async(to, body) => {
    client.messages.create({
        body: body,
        from: '+17343596910',
        to: to
    }).then((message) => {
        console.log(message.sid);
    }).done();
}