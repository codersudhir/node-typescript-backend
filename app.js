const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {sequelize} = require('./models');
const apiErrorHandler = require('./errors/ApiError.handler');
var cors = require('cors')
const fileupload = require("express-fileupload");
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');

const app = express();
const port= 8080 
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .catch((error) => console.log(error.message))

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
    'Origin',
   'Accept', 
   'Authorization'
    
  ],
};

app.use(cors(corsOpts));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    next();
}
app.use(allowCrossDomain);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cookieParser());

// app.use("/public",(req, res) => {
//   res.json({status: "yup"});})
app.use(fileupload());
app.use(bodyParser.json());
app.use('/', indexRouter);

// app.use(express.bodyParser({uploadDir:'./uploads'}));
app.use(function (req, res, next) {
    next(createError(404));
});

// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     res.status(err.status || 500);
//     res.render('error');
// });



app.use(apiErrorHandler)

app.listen(port, function(err){
    sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        sequelize.sync({alter: false,}).then(() => {
            console.log("Tables Created if not exists! || ", port)
        });
    }).catch(err => {
    console.error('Unable to connect to the database:',     err);
});
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port",     port);
})


module.exports = app;
