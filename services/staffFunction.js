// tìm kiếm thông tin của 1 user by keyword( id, username, email, phonenumber, stk) ->  trả về thông tin user
// lấy lịch sử giao dịch 1 user by keyword( id, username, email, phonenumber, stk)
// thêm tiền cho customer -> search -> add
// get tất cả customer
// 


const User = require('./user');
const AccountInfo = require('./accountInfo');
const Activity = require('./staffActivityLog')

const findInfoOffCustomer = async key => {

    const foundAccount = await AccountInfo.getBySTKOne(key);

    return foundAccount;
}

const findActivityStaff = async (staffID, numpage, limit) => {
    const found = await Activity.getAllActivity(staffID, numpage, limit);
    return found;
}
const countActivityStaff = async (staffID) => {
    const count = await Activity.count({
        where: {
            staffID,
        }
    });

    return (Math.floor(count / 10) + (count % 10 > 0 ? 1 : 0));
}

module.exports = { findInfoOffCustomer, findActivityStaff, countActivityStaff }
