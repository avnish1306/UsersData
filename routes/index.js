var express = require('express');
var router = express.Router();
const url = require('url');
var firebase = require('firebase');
var admin = require('firebase-admin');
var serviceAccount = require("./service-account.json");
var rn = require('random-number');
var nodemailer = require('nodemailer');
var mailFrom = "testmail270518";

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: mailFrom,
        pass: 'testing@123'
    }
});

var sendMailTo = function(userName, userEmail) {
    transporter.sendMail({
        from: mailFrom,
        to: userEmail,
        subject: 'Success message',
        text: 'Dear ' + userName + ' Welcome to our app'
    }, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://userdata-cd372.firebaseio.com"
});

var db = admin.database();
var ref = db.ref('userInformation');


router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
    //--


});

router.get('/sent', function(req, res, next) {
    console.log(req.query.userName);
    //var usersRef = ref.child(id);
    ref.push({
        Name: req.query.userName,
        Email: req.query.userEmail
    });
    sendMailTo(req.query.userName, req.query.userEmail);
    res.render('sent', { userName: req.query.userName, userEmail: req.query.userEmail });

});

router.post('/sent/submit', function(req, res, next) {
    console.log("sent/submit");
    var userName = req.body.userName;
    var userEmail = req.body.userEmail;
    res.redirect(url.format({
        pathname: "/sent/",
        query: {
            "userName": userName,
            "userEmail": userEmail,
        }
    }));

});


/*
router.post()*/

module.exports = router;