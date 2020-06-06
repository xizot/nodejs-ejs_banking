const express = require('express');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const app = express();
const cookieSession = require('cookie-session');
const db = require('./services/db');

const Transfer = require('./services/transfer.js');
const AccountInfo = require('./services/accountInfo.js');

//cookie session
app.use(cookieSession({
    name: 'session',
    keys: ['1232'],
}))


//use static folder
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//use middlewares
app.use(require('./middlewares/auth'));

//set layout
app.set('views', './views');
app.set('view engine', 'ejs');

//get request
app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/update-phone-number', require('./routes/updatePhoneNumber'));
app.use('/active-phone-number', require('./routes/activePhoneNumber.js'));

app.get('/transfer', (req, res) => {
    return res.render('transfer');
})




db.sync().then(function () {
    app.listen(PORT, function () {
        console.log('server listening on port ' + PORT);
    });
}).catch(function (error) {
    console.error(error);
})








