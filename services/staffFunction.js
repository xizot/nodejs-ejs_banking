// tìm kiếm thông tin của 1 user by keyword( id, username, email, phonenumber, stk) ->  trả về thông tin user
// lấy lịch sử giao dịch 1 user by keyword( id, username, email, phonenumber, stk)
// thêm tiền cho customer -> search -> add
// get tất cả customer
// 


const User = require('./user');
const AccountInfo = require('./accountInfo');

const findInfoOffCustomer = async key => {
    const found = await User.findBySomeThing(key);

    if (found) return found;

    const foundAccount = await AccountInfo.getBySTKOne(key);
    console.log(foundAccount);

    if (!foundAccount) return null;

    console.log('ádddd=================');

    const userID = foundAccount.userID;

    const f = await User.findByPk(userID);
    return f;

}

module.exports = { findInfoOffCustomer }
