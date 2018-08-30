'use strict';
const config = require('../config');
var cielo = require('cielo')(config.paramsCielo);

exports.paymentCreditCard = async(dadosSale) => {
    
    const transaction = await cielo.creditCard.simpleTransaction(dadosSale)
        .then((data) => {
            return data;
        })
        .catch((err) => {
            return err;
        });

}

exports.paymentDebitCard = async(dadosSale) =>  {

    const transaction = await cielo.debitCard.simpleTransaction(dadosSale)
        .then((data) => {
            return data;
        })
        .catch((err) => {
            return err;
        });
   
}