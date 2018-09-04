global.SALT_KEY = 'f5b99242-6504-4ca3-90f2-05e78e5761ef';
global.EMAIL_TMPL = '{0}';

module.exports = {
    //Development
    //url: 'http://localhost:8080/notamais-web/',
    //Production
    url: 'https://notamais.herokuapp.com/',
    connectionString: 'mongodb://admin:master123@ds018268.mlab.com:18268/notamais',
    sendgridkey: 'SG.gg0ckczPT5GUvrfyS0b4Vg.RY5V3Tc58P0VRbeccbYaw8C0138xN94qtsunmwUTRcU',
    containerConnectionString: 'TBD',
    paramsCielo : {
        'MerchantId': '4d347b59-7fc2-4379-b810-e5bb622252a3',
        'MerchantKey': 'OIXNKMDLUTWVCNURBNBULMWWQGPHPYLNZXBGGCGA',
        'RequestId': '', // Opcional - Identificação do Servidor na Cielo
        'sandbox': true, // Opcional - Ambiente de Testes
        'debug': true // Opcional - Exibe os dados enviados na requisição para a Cielo
    },
    paramsTwilio: {
        'accountSid': 'AC90d7d99c80eed05a769e762d8b379570',
        'apiKey': 'SK37cf6a0ef09d092a70f777667a4ecffc',
        'apiSecret': '3oIxqdUXuoSnrXjtKz64I5fya8OB3Iil'
    }
}