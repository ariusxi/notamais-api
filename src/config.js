global.SALT_KEY = 'f5b99242-6504-4ca3-90f2-05e78e5761ef';
global.EMAIL_TMPL = '{0}';

module.exports = {
    connectionString: 'mongodb://admin:master123@ds018268.mlab.com:18268/notamais',
    sendgridkey: 'SG.gg0ckczPT5GUvrfyS0b4Vg.RY5V3Tc58P0VRbeccbYaw8C0138xN94qtsunmwUTRcU',
    containerConnectionString: 'TBD',
    paramsCielo: {
        'MerchantId': '724941ed-a97f-4d24-8d40-7f8aee02bc86',
        'MerchantKey': '',
        'RequestId': 'xxxxxxx', // Opcional - Identificação do Servidor na Cielo
        'sandbox': true, // Opcional - Ambiente de Testes
        'debug': true // Opcional - Exibe os dados enviados na requisição para a Cielo
    }
}