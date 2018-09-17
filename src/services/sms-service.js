'use strict';

exports.send = async(to, body) => {
    let request = require('request');

    let options = {
        url: "https://platform.clickatell.com/messages",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "WFaPj5HtRu6HexYmYhiu0g=="
        },
        json: {
            content: body,
            to: ["5511"+to]
        }
    };

    request(options, (error, response, body) => {
        return response.statusCode;
    });
}