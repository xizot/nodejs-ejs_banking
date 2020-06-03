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




db.sync().then(function () {
    app.listen(PORT, function () {
        console.log('server listening on port ' + PORT);
    });
}).catch(function (error) {
    console.error(error);
})








