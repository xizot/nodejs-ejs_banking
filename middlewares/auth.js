const User = require('../services/user');
const AccountInfo = require('../services/accountInfo');
const asyncHandler = require('express-async-handler');


// process.env.BASE_URL = 'https://btcn06-1760131.herokuapp.com';


module.exports = asyncHandler(async function auth(req, res, next) {
    const userID = req.session.userID || null;
    res.locals.currentUser = req.user || null;
    req.currentUser = req.user || null;
    var accountInfo = null;
    if (req.currentUser) {
        accountInfo = await AccountInfo.getByUserID(req.currentUser.id);
    }
    if (!userID) {
        return next();
    }

    const user = await User.findByID(userID);
    accountInfo = await AccountInfo.getByUserID(user.id);
    if (!user) {
        return next();
    }



    if (!user.token) {
        req.currentUser = user;
        res.locals.currentUser = user;
        return next();
    }

    return next();
})