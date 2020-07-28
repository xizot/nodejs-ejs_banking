const express = require('express');
const router = express.Router();

// const io = require('socket.io-client');
// process.env.BASE_URL = "http://localhost:5000";

// if(req.currentUser){
//     let socket = io("http://localhost:5000");

//     console.log(req.currentUser);

//     socket.on('connect', () => {
//         // or with emit() and custom event names
//           socket.emit('transfer', {id:"2132132"});
//           socket.on('server-send-client',data=> {
//             console.log(data);
//         });
//     });
// }



router.get('/', (req, res) => {



    if (req.currentUser && req.currentUser.forgotCode) {
        req.session.fgEmail = user.email;

        return res.redirect('/forgot-password');
    }
    if (req.currentUser && !req.currentUser.email && req.currentUser.permisstion == 0) return res.redirect('/add-mail');

    if (req.currentUser && req.currentUser.token && req.currentUser.permisstion == 0) return res.redirect('/active');

    if (req.currentUser) {
        return req.currentUser.permisstion == 0 ? res.render('index') : res.render('staff-index');
    }
    return res.render('index');
})

module.exports = router;