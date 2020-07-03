const User = require('../services/user');
const AccountInfo = require('../services/accountInfo');


// process.env.BASE_URL = 'https://btcn06-1760131.herokuapp.com';


module.exports = async function auth(req, res, next) {


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

    if (!user) {
        return next();
    }
    accountInfo = await AccountInfo.getByUserID(user.id);
    req.currentUser = user;
    res.locals.currentUser = user;
    return next();
}