const passport = require('passport');


module.exports = (req, res) => {
    req.logout();
    delete req.session.userID;
    res.redirect('/');
}