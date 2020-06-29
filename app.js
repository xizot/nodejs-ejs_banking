const express = require('express');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const app = express();
var http = require('http').createServer(app)
var io = require('socket.io').listen(http);
const cookieSession = require('cookie-session');
const db = require('./services/db');
const passport = require('./middlewares/passport');

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

//set layout
app.set('socketio', io);
app.set('views', './views');
app.set('view engine', 'ejs');

//get request
app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
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
app.use('/user-request',require('./routes/userRequest'));

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
        // io.emit("server-said", data);
        console.log(data);
    });

    socket.on('client-send-user', data => {
        console.log(data);
    })

});



const Transfer = require('./services/transfer.js');

const SavingAccounts = require('./services/savingaccounts.js');
const Op = require('sequelize').Op
app.use('/lichsu', require('./routes/historyTransfer'));


db.sync().then(function () {
    http.listen(PORT, function () {
        console.log('server listening on port ' + PORT);
    });
}).catch(function (error) {
    console.error(error);
})








