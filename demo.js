const Nexmo = require('nexmo');

const nexmo = new Nexmo({
    apiKey: '09856490',
    apiSecret: 'ouK6Au5WEHKxkQec',
});

const from = 'Vonage APIs';
const to = '84859888905';
const text = 'Hello from Vonage SMS API';

nexmo.message.sendSms(from, to, text, (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(res);
    }
});