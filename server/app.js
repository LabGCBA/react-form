/*jshint esnext: true */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const fs = require('fs');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }))

app.options('/mail', function (req, res) {
    res.sendStatus(200);
});


app.post('/mail', function (req, res) {
    const recipient = 'laboratoriogobab@gmail.com';
    const sender = 'laboratoriogobab@gmail.com';

    const options = {
        auth: {
            api_user: 'demo',
            api_key: 'demo'
        }
    };

    const client = nodemailer.createTransport(sgTransport(options));
    const templateString = fs.readFileSync('views/email.ejs', 'utf-8');
    const emailString = ejs.render( templateString, {
        projectName: req.body.projectName,
        projectRequestingArea: req.body.projectRequestingArea,
        projectDescription: req.body.projectDescription
    });

    const email = {
        from: sender,
        to: recipient,
        subject: 'Nuevo Proyecto: ' + req.body.projectName,
        html: emailString
    };

    client.sendMail(email, function(err, info){
        if (err){
            console.log(error);
        }
        else {
            console.log('Message sent: ' + req.body.projectName);
            res.sendStatus(200);
        }
    });
});

app.listen(5000, function () {
    console.log('Server app listening on port 5000!');
});