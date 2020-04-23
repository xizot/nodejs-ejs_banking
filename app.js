const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

//use static folder
app.use(express.static('public'));


//set layout
app.set('views', './views');
app.set('view engine', 'ejs');

//get request
app.get('/', require('./routes/index'));



app.listen(PORT, function () {
    console.log('server listening on port ' + PORT);
});