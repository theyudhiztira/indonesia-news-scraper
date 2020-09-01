'use_strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');
const DateConverter = require("../helpers/DateConverter")

const Detik = function(){};

Detik.prototype.source = 'Detik';
Detik.prototype.baseUrl = 'https://www.detik.com/search/searchnews';

Detik.prototype.headless = true;
Detik.prototype.convertDate = (dateString) => {
    const dateConverter = new DateConverter(dateString);
    dateString = dateConverter.wib().day().monthAbbr().dateString;

    const d = moment(dateString, 'DD MMMM YYYY HH:mm');
    return d.toISOString();
}

Detik.prototype.scrap = (query = null) => {
    let url = Detik.prototype.baseUrl;

    if (!query){
        throw new Error('Please provide a keyword!');
    }

    url += `?query=${query}`;

    return puppeteer
    .launch({headless: Detik.prototype.headless})
    .then(browser => browser.newPage())
    .then(page => {
        return page.goto(url).then(() => {
            return page.content();
        });
    })
    .then(html => {
        const $ = cheerio.load(html);
        const newsData = [];
        $('article').each((e, el) => {
            $(el).find('.date').children().remove('.category');

            newsData.push({
                title: $(el).find('.title').text(),
                url: $(el).find('a').attr('href'),
                img: $(el).find('img').attr('src'),
                date: Detik.prototype.convertDate($(el).find('.date').html())
            });
        });

        return newsData;
    })
    .catch(err => new Error(err));
}

module.exports = new Detik();
