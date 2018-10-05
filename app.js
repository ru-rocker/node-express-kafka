var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messagesRouter = require('./routes/messages');

var kafka = require('kafka-node');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const defaultTopicName = 'node.kafka.test.t'

const client = new kafka.KafkaClient({
  kafkaHost: 'jktdc-mdwpoc1.azlife.allianz.co.id:9092,jktdc-mdwpoc2.azlife.allianz.co.id:9092,jktdc-mdwpoc3.azlife.allianz.co.id:9092'
});
const producer = new kafka.HighLevelProducer(client);
const consumer = new kafka.Consumer(client, [{ topic: defaultTopicName }], {
  groupId: 'node-express-kafka-group'
});

producer.on('ready', function () {

  console.log("Kafka Producer is connected and ready.");
  app.use(function (req, res, next) {
    req.producer = producer;
    req.client = client;
    req.defaultTopicName = defaultTopicName;
    next();
  });

  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/messages', messagesRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
});

producer.on('error', function (error) {
  console.log("Error", error);
});

consumer.on('message', function (message) {
  var buf = new Buffer(message.value, "binary"); 
  var decodedMessage = JSON.parse(buf.toString());
  console.log(JSON.stringify(decodedMessage));
});

consumer.on('error', function (error) {
  console.log(error);
});

module.exports = app;