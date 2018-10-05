# Overview
This is only a simple demo how to send to and retrieve message from Kafka Topics.
The topics itself is defaulted to `node.kafka.test.t`.
You can change the topic name on `app.js`

# Outline
The outline for this project is creating a topic in the kafka.
Then there is a REST endpoint `/messages` with **POST** method to send message to kafka.

     {
	    "message" : {"key": "Standing in the shoulder of a giant"}
     }

Then there is a subscriber to retrieve messages from kafka topic.

# Libraries
For this demo, I use express-generator and kafka node as the library.
      
      npm install kafka-node --save
