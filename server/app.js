const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// connexion à la base de données
const dbConnection = require('./controllers/db.controller.js');

// define routers
const showRouter = require('./routes/show.route');
//const indexRouter = require('./routes/index.route');
const accessRouter = require('./routes/access.route');
const userRouter = require('./routes/user.route');
 const itemRouter = require('./routes/item.route');


// define middlewares
const error = require('./middlewares/error.middleware');
const authMiddleware = require('./middlewares/authentication.middleware');

// create app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// global middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public2')));

// routes middlewares
app.use('/access', accessRouter);

app.use(authMiddleware.validToken);

// routes middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use('/user', userRouter);
app.use('/item', itemRouter);
app.use('/*', showRouter);


// in all other cases use error middleware
app.use(error);

module.exports = app;
