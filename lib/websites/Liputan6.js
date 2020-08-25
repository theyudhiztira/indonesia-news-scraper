'use_strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');
const { html } = require('cheerio');

const Liputan6 = function(){};

Liputan6.prototype.source = 'Liputan6';
Liputan6.prototype.baseUrl = 'https://www.liputan6.com/search';

Liputan6.prototype.scrap = (query = null) => {
    let url =  Liputan6.prototype.baseUrl;

    if(!query){
        throw new Error('Please provide a keyword!');        
    }

    url += `?q=${query}`;

    return puppeteer
    .launch({
        headless: true
    })
    .then(browser => browser.newPage())
    .then(page => {
        return page.goto(url).then(() => {
            return page.goto(url).then(() => {
                return page.content();
            });
        });
    })
    .then(html => {
        const $ = cheerio.load(html);
        const newsData = [];
        $('article[class="articles--iridescent-list--item articles--iridescent-list--text-item"]').each((e, el) => {
            newsData.push({
                title: $(el).find('.articles--iridescent-list--text-item__figure-thumbnail-link').attr('title'),
                url: $(el).find('.articles--iridescent-list--text-item__figure-thumbnail-link').attr('href'),
                img: ($(el).find('picture').children()[2]).attribs['data-src'] ? ($(el).find('picture').children()[2]).attribs['data-src'] : ($(el).find('picture').children()[2]).attribs.src,
                date: Liputan6.prototype.convertDate($(el).find('aside').find('header').children().find('[class="articles--iridescent-list--text-item__time timeago"]').first().attr('datetime'))
            });
        });

        return newsData;
    })
    .catch(err => new Error(err));
}

Liputan6.prototype.convertDate = (dateString) => {
    var d = moment(dateString);
    return d.toISOString();
};

module.exports = new Liputan6();