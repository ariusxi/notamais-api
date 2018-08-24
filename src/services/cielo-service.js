'use strict';
const config = require('../config');
const cielo = require('cielo')(config.paramsCielo);

exports.createTransaction = async() => {
    let dadosSale = {
        "MerchantOrderId":"2014111703",
        "Customer":{  
            "Name":"Comprador crédito simples"
        },
        "Payment":{  
            "Type":"CreditCard",
            "Amount":15700,
            "Installments":1,
            "SoftDescriptor":"123456789ABCD",
            "CreditCard":{  
                "CardNumber":"0000000000000001",
                "Holder":"Teste Holder",
                "ExpirationDate":"12/2030",
                "SecurityCode":"123",
                "Brand":"Visa"
            }
        }
    };

    const transation = await cielo.creditCard.simpleTransaction(dadosSale);
    console.log(transation);
}