const express = require('express');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const app = express();
const cookieSession = require('cookie-session');
const db = require('./services/db');

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
app.use('/register', require('./routes/register'));
app.use('/todo', require('./routes/todo'));
app.use('/api', require('./routes/api'));
app.use('/active', require('./routes/active'));
app.use('/resend', require('./routes/resend'));
app.use('/news/api', require('./routes/news'));
app.use('/news', require('./routes/crawler'));



db.sync().then(function () {
    app.listen(PORT, function () {
        console.log('server listening on port ' + PORT);
    });
}).catch(function (error) {
    console.error(error);
})








