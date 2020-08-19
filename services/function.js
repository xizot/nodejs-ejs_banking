const Nexmo = require("nexmo");
const nodemailer = require("nodemailer");
const User = require("./user");
const AccountInfo = require("./accountInfo");
const Customer = require("./customer");
const Transfer = require("./transfer");
const Notification = require("./notification");
const StaffActivity = require("./staffActivityLog");
const moment = require("moment");

process.env.ADMIN_EMAIL = "1760131bot@gmail.com";
process.env.ADMIN_PASSWORD = "learnenglish";
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
    from: `"Payyed Bank 👻" <${process.env.ADMIN_EMAIL}>`, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: content, // plain text body
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

process.env.API_KEY = "09856490";
process.env.API_SECRET = "ouK6Au5WEHKxkQec";
const from = "Vonage APIs";
const nexmo = new Nexmo({
  apiKey: "09856490",
  apiSecret: "ouK6Au5WEHKxkQec",
});

const sendSMS = (to, text) => {
  setTimeout(() => {
    nexmo.message.sendSms(from, to, text, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  }, 0);
};
const getStructure = (title, content) => {
  return `<div><h3 style="color:#333; text-transform:uppercase; text-align:center; font-size:30px; font-family:Tahoma,Arial,Helvetica,sans-serif">${title}<h3>
      <div style="padding:20px;background-color:#f1f5f6; border-radius:10px;margin:30px;font-family:Tahoma,Arial,Helvetica,sans-serif; font-size:14px;color:#333;min-height:250px">
          <h3 style="font-size:18px; font-weight:bold;text-align:center;color:#333">${content}</h3>
        <p style="margin:40px 0 0;text-align:center">Cảm ơn bạn đã tin tưởng,</p>
        <p style="font-size:18px; margin-top:5px;text-align:center">Pa<span style="color:#29ad57; font-weight:bold">yy</span>ed.</p>
      </div>`;
};

const findCustomerInfo = async (id) => {
  var rsUser = null;

  const user = await User.findByPk(id); // thong tin ve tai khaon
  const customer = await Customer.findByPk(id); // thong tin ve ca nhan
  const accountInfo = await AccountInfo.findByPk(id); // thong tin tai khoan ngan hang
  const tranferInfo = await Transfer.findByPk(id); // thong tin giao dicch

  rsUser = {
    displayName: user.displayName,
    STK: accountInfo.STK,
    CMND: customer.identity,
    date: tranferInfo.date,
    beginDate: accountInfo.beginDate,
    term: accountInfo.term,
    bankCode: accountInfo.bankCode,
    message: tranferInfo.message,
    balance: accountInfo.balance,
    LichSuChuyenTien: tranferInfo != null ? 1 : 0, // 0 chưa chuyển lần nào, 1 đã chuyển haowjc nhận ( tồn tại trong db)
    from: tranferInfo != null ? tranferInfo.from : -1, //-1 là chưa chuyển tiền, lúc show
    to: tranferInfo != null ? tranferInfo.to : -1,
    amount: tranferInfo != null ? tranferInfo.amount : -1,
  };

  return rsUser;
};

const calculatorProfit = (term, beginDate, balance) => {
  const months = moment().diff(beginDate, "months");
  const day = moment().diff(beginDate, "days");

  let percent = 0;
  if (term >= 0 && term <= 1) percent = 0.05;
  else if (term < 3) percent = 0.05;
  else if (term < 6) percent = 0.15;
  else if (term < 9) percent = 0.35;
  else if (term >= 9) percent = 0.5;

  if (months < term) percent *= 0.5; // neu rut tien truoc thoi han

  const max = (Number(balance) + Number(balance) * percent).toFixed(4); // so tien toi da duoc nhan neu dung han

  const currentProfit = (balance * percent * (day / 360)).toFixed(4);

  let profit = currentProfit > percent ? percent : currentProfit;
  profit = profit < 0 ? 0 : profit;

  let total =
    (Number(balance) + Number(profit)).toFixed(4) > max
      ? max
      : (Number(balance) + Number(profit)).toFixed(4);
  return {
    percent,
    profit,
    total,
    months,
    day,
  };
};

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const randomSTK = () => new Date().valueOf();

// Các chức năng của Nhân viên

// - [ ]  Lấy tất cả thông báo của user ( xác thực tài khoản, yêu cầu mở tài khoản ngân hàng, yêu cầu mở tài khoản tiết kiệm)
// - [ ]  Xử lí các yêu cầu của user ở trên

// - [ ]  Khóa và xóa user
const StaffBlockUser = async (userID) => {
  const found = await User.findByPk(userID);
  if (found) {
    found.isActive = 2;
    found.save();

    Notification.addPrevent(staffID, value.userID, 2).then((value) => {
      const msg = `Nhân viên ${staffID} đã xóa tài khoản ${value.userID}`;
      StaffActivity.addStaffActivity(staffID, msg);
    });
  }
  return null;
};

const StaffDeleteUser = async (staffID, userID) => {
  const found = await User.findByPk(userID);
  if (found) {
    return User.destroy({
      where: {
        id: userID,
      },
    }).then((value) => {
      Notification.addPrevent(staffID, value.userID, -1).then((value) => {
        const msg = `Nhân viên ${staffID} đã xóa tài khoản ${value.userID}`;
        StaffActivity.addStaffActivity(staffID, msg);
      });

      return value;
    });
  }
  return null; // không tồn tại
};

// - [x]  Tìm user theo id, sdt, email ,....
// - [ ]  Hiển thị lịch sử xác thực tài khoản, lịch sử chuyển tiền

// - [ ]  Thêm tiền vào tài khoản cho user
const StaffRechargeToUser = async (
  staffID,
  userID,
  STK,
  amount,
  currencyInit
) => {
  const found = await AccountInfo.getInfoBySTKandUserID(userID, STK);
  if (found) {
    return found.staffRecharge(staffID, currencyInit, amount);
  }
  return null;
};

// hàm này để tạo thẻ ngân hàng cho 1 user bởi 1 nhân viên
const CreateNewCreditCard = async (userID, displayName) => {
  const STK = randomSTK();
  const isDefault = false;
  const newCreditCard = await AccountInfo.create({
    STK,
    userID,
    isDefault,
    displayName,
  });
  return newCreditCard;
};

// - [ ]  Ghi lại lịch sử staff ( khi xử lí yêu cầu của user, xóa, khóa, thêm tiền,...)

// - [ ]  Reset password cho user
// - [ ]  Thêm thông tin cho user

module.exports = {
  sendMail,
  sendSMS,
  findCustomerInfo,
  validateEmail,
  randomSTK,
  StaffBlockUser,
  StaffDeleteUser,
  StaffRechargeToUser,
  CreateNewCreditCard,
  calculatorProfit,
  getStructure,
};
