var express = require('express');
var path = require('path');
var logger = require('morgan');
const cors = require("cors")
const mongoose = require("mongoose");
const emailTemplate = require('./helper/emailTemplate');
const emailHelper = require("./helper/ics.helper")



require("dotenv").config()


var app = express();
mongoose
    .connect(process.env.MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        emailHelper.createTemplateIfNotExist({ name: "ics", subject: "Mentor session", description: "This template is used inside mentor email", template_key: "ics", from: "tan.vo@coderschool.vn", variables: ["mentor", "mentee", "checkInLink", "cancelLink", "startAt", "meetingLink"], subject: "Mentor session schedule", html: emailTemplate.ics })
        emailHelper.createTemplateIfNotExist({ name: "ics-mentee", subject: "Mentor session", description: "This template is used inside mentee email", template_key: "ics-mentee", from: "tan.vo@coderschool.vn", variables: ["mentor", "mentee", "startAt", "meetingLink"], subject: "Mentor session schedule", html: emailTemplate.icsMentee })
        emailHelper.createTemplateIfNotExist({ name: "event", subject: "Event", description: "This template is used inside the calendar", template_key: "event", from: "tan.vo@coderschool.vn", variables: ["mentor", "mentee", "checkInLink", "cancelLink", "startAt", "description"], subject: "Mentor session schedule", html: emailTemplate.event })
        emailHelper.createTemplateIfNotExist({ name: "overlap", subject: "Overlap", description: "This template is used for overlap session", template_key: "overlap", from: "tan.vo@coderschool.vn", variables: ["user1", "user2", "startAt"], subject: "Overlap session", html: emailTemplate.overlap })
        emailHelper.createTemplateIfNotExist({ name: "reschedule", subject: "Reschedule warning", description: "This template is used for reschedule within 23 hours", template_key: "reschedule", from: "tan.vo@coderschool.vn", variables: ["mentee"], subject: "Reschedule within 24 hours", html: emailTemplate.reschedule })
        console.log(`Mongoose successfully connect to database`);
    })
    .catch((err) => console.log(err));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

// app.use('/', indexRouter);

module.exports = app;
