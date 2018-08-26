'use strict';
const config = require('../config');
var cielo = require('cielo')(config.paramsCielo);

exports.paymentCreditCart = async() => {
    var dadosSale = {  
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
    }

    const transaction = await cielo.creditCard.simpleTransaction(dadosSale);
    console.log(transaction);
}