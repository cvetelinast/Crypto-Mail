var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

 var transporter = nodemailer.createTransport();
// create reusable transport method (opens pool of SMTP connections)
// var smtpTransport = nodemailer.createTransport("SMTP",{
//     service: "Gmail",
//     auth: {
//         user: "no-reply@gmail.com",
//         pass: "userpass"
//     }
// });

  
  var mailOptions = {
    from: 'no-reply@gmail.com',
    to: 'cvetelinast.96@abv.bg',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

var index = require('./routes/index');
var users = require('./routes/users');
var messages = require('./routes/messages');

const port = process.env.PORT || '3000';
//app.set('port', port);

var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set Static Folder
app.use(express.static(path.join(__dirname, 'client')));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', index);
app.use('/api', users);
app.use('/api', messages);

app.listen(port, function(){
    console.log('Server started ot port: ' + port);
});