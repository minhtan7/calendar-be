var express = require('express');
var path = require('path');
var logger = require('morgan');
const cors = require("cors")
const mongoose = require("mongoose")

var indexRouter = require('./routes/index');
require("dotenv").config()


var app = express();


mongoose
    .connect(process.env.MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log(`Mongoose successfully connect to database `);
    })
    .catch((err) => console.log(err));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', indexRouter);

module.exports = app;
