const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var http = require('http').createServer(app)
var io = require('socket.io').listen(http);
const PORT = process.env.PORT || 3000;
const cookieSession = require('cookie-session');
const db = require('./services/db');
const passport = require('./middlewares/passport');
const rate = require('./crawler');

//cookie session
app.use(cookieSession({
    name: 'session',
    keys: ['1232'],
}))


//use static folder
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//use middlewares
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./middlewares/auth'));
app.use(require('./middlewares/staff'));

//set layout
app.set('socketio', io);
app.set('views', './views');
app.set('view engine', 'ejs');

//get request
app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/forgot-password', require('./routes/forgotPassword'));
app.use('/change-password', require('./routes/userActions/changePassword'));
app.use('/logout', require('./routes/logout'));
app.use('/update-phone-number', require('./routes/updatePhoneNumber'));
app.use('/active-phone-number', require('./routes/activePhoneNumber.js'));
app.use('/quanli', require('./routes/staff.js'));
app.use('/error', require('./routes/error.js'));
// app.use('/recharge',require('./routes/recharge.js'));
app.use('/transfer', require('./routes/transfer'));
app.use('/info', require('./routes/info'));
app.use('/api', require('./routes/api'));
app.use('/transfer-success', require('./routes/transfer-success'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/bank-account', require('./routes/bankAccount'));
app.use('/add-Mail', require('./routes/addMail'));
app.use('/active', require('./routes/active'));
app.use('/page-confirm', require('./routes/page-confirm'));
app.use('/user-request', require('./routes/userRequest'));
app.use('/alert', require('./routes/alert/alert'));

// app.use('/staff', require('./routes/staff/request'));
app.use('/staff/api', require('./routes/staff/api'));
app.use('/staff-action', require('./routes/api/staff-api'));
app.use('/request', require('./routes/staff/request'));
app.use('/add-money', require('./routes/staffAddMoney'));
app.use('/staff-activity', require('./routes/staffActivity'));
app.use('/about', require('./routes/about'));
// user
app.use('/my-account', require('./routes/user/myaccount'));
app.use('/accounts', require('./routes/account'));
app.use('/history', require('./routes/history'));
app.use('/user-request', require('./routes/user/request'));
app.use('/create-credit-card', require('./routes/createCreditCard'));
app.use('/create-saving-card', require('./routes/createSavingCard'));
app.use('/contact', require('./routes/contact'));
app.use('/change-limit', require('./routes/changeLimit'));
// STAFF HERE
app.use('/user', require('./routes/staff/user'));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });



const users = [];


io.on('connection', (socket) => {
    socket.on("transfer", data => {

        // socket.id = data.id;
        // users.push(socket.id);
        // socket.emit('server-send-client',`Hế lô id: ${data.id}`);

        socket.broadcast.emit('server-send-client', 'Có 1 đứa mới vào ae');
    });

    socket.on("add-new-noti", data => {

        socket.broadcast.emit('update-noti', 'có yêu cầu mới');
    });


});




app.use('/lichsu', require('./routes/historyTransfer'));


db.sync().then(function () {
    http.listen(PORT, function () {
        console.log('server listening on port ' + PORT);
    });
}).catch(function (error) {
    console.error(error);
})








