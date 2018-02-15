var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://user1:user1@ds161346.mlab.com:61346/my_database', ['messages']);
var nodemailer = require('nodemailer');
var decodeModule = require('./cryptoResources/caesar');

let userMail = decodeModule.decode('fubswrPdloQrwlilfdwru@jpdlo.frp');
let userPass = decodeModule.decode('fubswrPdloSdvvzrug');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: userMail,
        pass: userPass
    }
});

// get all messages
router.get('/messages', function (req, res, next) {
    db.messages.find(function (err, messages) {
        if (err) {
            res.send(err);
        }
        res.json(messages);
    });
});

// get single user's received messages
// :id is the id of user in table 'users'
router.get('/messages/:id', function (req, res, next) {
    db.messages.find({ toId: req.params.id }, function (err, messages) {
        if (err) {
            res.send(err);
        }
        res.json(messages);
    });
});


// save message
router.post('/messages', function (req, res, next) {
    let message = req.body;
    if (!message.from || !message.fromEmail) {
        res.status(400);
        res.json({ "error": "No information from who." });
    } else if (!message.to || !message.toEmail || !message.toId) {
        res.status(400);
        res.json({ "error": "No information to who." });
    } else {
        db.messages.save(message, function (err, message) {
            if (err) {
                res.send(err);
            }
            res.json(message);
        });
        var mailOptions = {
            from: 'youremail@gmail.com',
            to: message.toEmail,
            subject: 'You have new message from ' + message.from,
            text: 'Visit your profile in Crypto Mail.'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log(message.fromEmail + ' sent email to ' + message.toEmail + ' ' + info.response);
            }
        });
    }
});

// delete message
router.delete('/messages/:id', function (req, res, next) {
    db.messages.remove({ _id: mongojs.ObjectId(req.params.id) }, function (err, message) {
        if (err) {
            res.send(err);
        }
        res.json(message);
    });
});

// update message
router.put('/messages/:id', function (req, res, next) {
    var message = req.body;
    var updMessage = {};
    if (user.title) {
        updUser.title = user.title;
    }
    if (!message.from || !message.fromEmail) {
        res.status(400);
        res.json({ "error": "No information from who." });
    } else if (!message.to || !message.toEmail || !message.toId) {
        res.status(400);
        res.json({ "error": "No information to who." });
    } else {
        db.messages.update({ _id: mongojs.ObjectId(req.params.id) }, updTask, {}, function (err, message) {
            if (err) {
                res.send(err);
            }
            res.json(message);
        });
    }
});

module.exports = router;