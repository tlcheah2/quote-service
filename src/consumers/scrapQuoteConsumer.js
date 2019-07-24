const url = process.env.CLOUDAMQP_URL || "amqp://localhost";
const amqp = require('amqplib'); 
const { scrapQuoteOfTheDay } = require('../controllers/quoteController');

exports.start = () => {
    amqp.connect(url).then((connection) => {
        connection.createChannel().then((channel) => {
            const exchange = 'quote';
            channel.assertExchange(exchange, 'direct', {durable: false});
            channel.assertQueue('', { exclusive: true })
                .then((q) => {
                    channel.bindQueue(q.queue, exchange, '');
                    channel.prefetch(1);
                    channel.consume(q.queue, (msg) => {
                        console.log('msg', msg.content.toString());
                        // Let's go crawl msg  
                        scrapQuoteOfTheDay();
                        channel.ack(msg);
                    });
                })
                .catch((err) => {
                    console.log('assertQueue error', err);
                })
            
        });
    }).catch((err) => {
        console.error('Connect amqp failed', err);
    })
}
