const User = require('../services/user');

const asyncHandler = require('express-async-handler');


// process.env.BASE_URL = 'https://btcn06-1760131.herokuapp.com';


module.exports = asyncHandler(async function auth(req, res, next) {
    const userID = req.session.userID || null;
    res.locals.currentUser = req.user || null;
    req.currentUser = req.user || null;
    if (!userID) {
        return next();
    }

    const user = await User.findByID(userID);
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