// Import env file
require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const { keepAwake } = require('./src/util/heroku_util');
const { setQuoteEvent } = require('./src/controllers/quoteController');
const { start } = require('./src/consumers/scrapQuoteConsumer');

app.set('views', 'public');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    let existingData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'qotd.json'), {encoding: 'utf8'}));
    res.render('index', {quotes: existingData});
});

app.get('/quoteEvent', setQuoteEvent);
app.listen(process.env.PORT || 4000, () => {
    console.log('Server is runnning in port: ', process.env.PORT);
    keepAwake();
    start();
});