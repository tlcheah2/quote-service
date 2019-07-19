const url = process.env.CLOUDAMQP_URL || "amqp://localhost";
const amqp = require('amqplib'); 
const quote_queue = 'quote_queue';
const path = require('path');
const { scrapQuoteOfTheDay } = require('../controllers/quoteController');


amqp.connect(url).then((connection) => {
    connection.createChannel().then((channel) => {
        channel.assertQueue(quote_queue, { durable: true });
        channel.prefetch(1);
        channel.consume(quote_queue, (msg) => {
            console.log('msg', msg.content.toString());
            // Let's go crawl msg  
            scrapQuoteOfTheDay();
        });
    });
}).catch((err) => {
    console.error('Connect amqp failed', err);
})