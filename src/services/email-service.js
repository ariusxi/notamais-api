'use strict';
const config = require('../config');
const sendgrid = require('sendgrid')(config.sendgridkey);

exports.send = async(to, subject, body) => {
    sendgrid.send({
        to: to,
        from: 'noreply@notamais.com',
        subject: subject,
        html: body
    });
}