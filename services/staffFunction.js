// tìm kiếm thông tin của 1 user by keyword( id, username, email, phonenumber, stk) ->  trả về thông tin user
// lấy lịch sử giao dịch 1 user by keyword( id, username, email, phonenumber, stk)
// thêm tiền cho customer -> search -> add
// get tất cả customer
// 


const User = require('./user');
const AccountInfo = require('./accountInfo');

const findInfoOffCustomer = async key => {

    const foundAccount = await AccountInfo.getBySTKOne(key);

    return foundAccount;

}

module.exports = { findInfoOffCustomer }
