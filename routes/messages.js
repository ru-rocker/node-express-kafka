var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
  let defaultTopicName = req.defaultTopicName
  let message = req.body.message
  let topicName = req.body.topicName || defaultTopicName
  let producer = req.producer;

  const buffer = new Buffer.from(JSON.stringify(message));
  let payloads = [{ topic: topicName, messages: buffer }]
  
  producer.send(payloads, function (err, data) {
    console.log(err, data);
    if(err) {
      res.status(500).send(JSON.stringify({
        "messages": "Error while sending messages.",
      }));
    } else {
      res.status(201).send(JSON.stringify({
        "messages": "Message sent."
      }));
    }
  });
  
});

router.post('/topics', function (req, res, next) {
  let defaultTopicName = req.defaultTopicName
  let topicName = req.body.topicName || defaultTopicName;
  var topics = [{
    topic: topicName,
    partitions: 2,
    replicationFactor: 3
  }];

  let client = req.client;
  client.createTopics(topics, (error, result) => {
    console.log(error, result)
    if (!error) {
      res.status(201).send(JSON.stringify({
        "messages": "Topic created."
      }));
    } else {
      res.status(500).send(JSON.stringify({
        "messages": "Error while creating topics.",
      }));
    }
  });
});

module.exports = router;