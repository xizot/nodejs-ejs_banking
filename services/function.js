const Nexmo = require('nexmo');
const nodemailer = require("nodemailer");
const User = require('./user');
const AccountInfo = require('./accountInfo');
const Customer = require('./customer');
const Transfer = require('./transfer');

process.env.ADMIN_EMAIL = '1760131bot@gmail.com';
process.env.ADMIN_PASSWORD = 'learnenglish';
process.env.BASE_URL = 'http://localhost:5000';
// async..await is not allowed in global scope, must use a wrapper
async function sendMail(to, subject, content, html) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.ADMIN_EMAIL, // generated ethereal user
            pass: process.env.ADMIN_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Admin 👻" <${process.env.ADMIN_EMAIL}>`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: content, // plain text body
        html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}



process.env.API_KEY = '09856490';
process.env.API_SECRET = 'ouK6Au5WEHKxkQec';
const from = 'Vonage APIs';
const nexmo = new Nexmo({
    apiKey: '09856490',
    apiSecret: 'ouK6Au5WEHKxkQec',
});

const sendSMS = (to, text) => {
    setTimeout(() => {
        nexmo.message.sendSms(from, to, text, (err, res) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(res);
            }
        });
    }, 0)
}

const findCustomerInfo = async id =>{
    var rsUser =null;
    // thong tin co ban o trong req. het r
    const user = await User.findByPk(id); // thong tin ve tai khaon
    const customer = await Customer.findByPk(id); // thong tin ve ca nhan
    const accountInfo = await AccountInfo.findByPk(id); // thong tin tai khoan ngan hang
    const tranferInfo = await Transfer.findByPk(id); // thong tin giao dicch


    //giờ đơn giản muốn lấy cái nào thì gọi thằng đó thôi. ví du //ấy tên
    rsUser = {
        displayName:user.displayName,
        STK : accountInfo.STK,
        CMND: customer.identity,
        date:tranferInfo.date,
        beginDate:accountInfo.beginDate,
        term: accountInfo.term,
        bankCode:accountInfo.bankCode,
        message: tranferInfo.message,
        balance:accountInfo.balance,
        LichSuChuyenTien: tranferInfo != null? 1 : 0 ,// 0 chưa chuyển lần nào, 1 đã chuyển haowjc nhận ( tồn tại trong db)
        from: tranferInfo != null?tranferInfo.from : -1, //-1 là chưa chuyển tiền, lúc show check điểu kiện là sao 
        to: tranferInfo != null?tranferInfo.to : -1,
        amount: tranferInfo != null?tranferInfo.amount : -1,
    }

    console.log(rsUser);
 
    return rsUser; 
 
}




module.exports = { sendMail, sendSMS, findCustomerInfo };