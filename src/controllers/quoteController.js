const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');
const path = require('path');
const quotesFilePath = path.join(process.cwd(), 'public', 'quotes.json');
const url = 'http://wisdomquotes.com/stoic-quotes/';
exports.scrapQuote = () => {
    rp(url).then((html) => {
        let quotes = $('blockquote > p', html);
        console.log('quote', quotes[0].children[0].data);
        let allQuotes = [];
        quotes.map((_, el) => {
            // console.log('index', index);
            const text = el.children[0].data;
            allQuotes.push(text);
        });
        fs.writeFile(quotesFilePath, JSON.stringify(allQuotes), (err) => {
            console.log('err', err);
        });
    }).catch((err) => {
        console.log('err', err);
    });
};

exports.scrapQuoteOfTheDay = () => {
    let qotdUrl = 'http://wisdomquotes.com/?time=' + (Date.now());
    rp(qotdUrl).then((html) => {
        let quote = $('.quotescollection-quote', html).text();
        let existingData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'qotd.json'), {encoding: 'utf8'}));
        existingData.push(quote);
        fs.writeFileSync(path.join(process.cwd(), 'public', 'qotd.json'), JSON.stringify(existingData));
        return quote;
    }).catch((err) => {
        console.log('err', err);
    });
}