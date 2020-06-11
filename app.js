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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//use middlewares
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./middlewares/auth'));

//set layout
app.set('views', './views');
app.set('view engine', 'ejs');

//get request
app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/logout', require('./routes/logout'));
app.use('/update-phone-number', require('./routes/updatePhoneNumber'));
app.use('/active-phone-number', require('./routes/activePhoneNumber.js'));
app.use('/quanli',require('./routes/staff.js'));
app.use('/transfer', require('./routes/transfer'));
app.use('/info', require('./routes/info'));
app.use('/api', require('./routes/api'));
app.use('/transfer-success', require('./routes/transfer-success'));
app.set('socketio', io);
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


//demo tim kieesm thong tin chuyen tien cua 1 user ( userID = 1)
// may cai demo nay k up.  khi nào làm thật rôi up cứ để ở local đi
// ko thì push nhưng lần sau púhs lại thì nhớ xóa nó đi. mấy chỗ console.log cnũg xóa bớt đi
// chỉ xóa mấy cái thừa nha. :v. ok k
// thừa: ví du: nãy t console.log(htrTransfer) để xem nó có xuất ra gì ko ( test) sau khi test xong thì xóa. ok? ok ok ok ok ok ok roi gio púh thoải mái đi
// sau khi hoàn thiện thì nhớ tạo PULL REQUESTh
const Transfer = require('./services/transfer.js');
const Op = require('sequelize').Op
app.use('/lichsu', async (req, res)=>{
    const rsUser =null;
    const htrTransfer = await Transfer.findAll(
        { 
            where:{
                [Op.or]:{
                    from:{
                        [Op.eq]:1
                    },
                    to:{
                        [Op.eq]:1
                    }
                    
                }
               
        }
    }); // lấy lịch sử giao dịch. 1 người có thể giao dịch nhiều lần nên phải tìm tất cả

    if(htrTransfer){
        return res.render('showTransferHistory',{rsUser, htrTransfer});
    }
    return res.end('khong co gi')
})

db.sync().then(function () {
    http.listen(PORT, function () {
        console.log('server listening on port ' + PORT);    
    });
}).catch(function (error) {
    console.error(error);
})








