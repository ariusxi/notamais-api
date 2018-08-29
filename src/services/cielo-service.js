'use strict';
const config = require('../config');
var cielo = require('cielo')(config.paramsCielo);

exports.paymentCreditCart = async(dadosSale) => {
    const transaction = await cielo.creditCard.simpleTransaction(dadosSale);
    console.log(transaction);
}