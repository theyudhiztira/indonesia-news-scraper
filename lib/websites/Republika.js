'use_strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');

const Republika = function(){};

Republika.prototype.source = 'Republika';
Republika.prototype.baseUrl = 'https://republika.co.id/search/';

Republika.prototype.headless = true;

Republika.prototype.scrap = (query = null) => {
    let url = Republika.prototype.baseUrl;

    if(!query){
        throw new Error('Please provide a keyword!');
    }

    url+=query;

    return puppeteer
    .launch({headless: Republika.prototype.headless})
    .then(browser => browser.newPage())
    .then(page => {
        return page.goto(url).then(() => {
            return page.content();
        });
    })
    .then(html => {
        const $ = cheerio.load(html);
        const newsData = [];
        $('.item-cari').each((e, el) => {
            newsData.push({
                title: $(el).find('.txt_subkanal').find('h2').text(),
                url: $(el).find('.txt_subkanal').find('h2').children().attr('href'),
                img: $(el).find('.img_subkanal').find('.lazy').attr('src'),
                date: Republika.prototype.convertDate($(el).find('.txt_subkanal').find('h6').html())
            });
        });

        return newsData;
    })
    .catch(err => new Error(err));
}

Republika.prototype.convertDate = (dateString) => {
    dateString = dateString.replace('WIB', '');

    var d = moment(dateString, 'DD MMMM YYYY HH:mm');
    return d.toISOString();
}

module.exports = new Republika();