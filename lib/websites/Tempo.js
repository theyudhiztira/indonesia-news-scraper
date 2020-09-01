'use_strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');
const DateConverter = require("../helpers/DateConverter")

const Tempo = function(){};
Tempo.prototype.source = 'Tempo';
Tempo.prototype.baseUrl = 'https://www.tempo.co/search?q=';

Tempo.prototype.headless = true;

Tempo.prototype.scrap = (query = null) => {
    let url = Tempo.prototype.baseUrl;
    if (!query) {
        throw new Error('Please provide a keyword!');
    }
    url+=`${query}#gsc.tab=0&gsc.q=${query}&gsc.sort=date`;

    return puppeteer
    .launch({headless: Tempo.prototype.headless})
    .then(browser => browser.newPage())
    .then(page => {
        return page.goto(url).then(() => {
            return page.content();
        });
    })
    .then(html => {
        const $ = cheerio.load(html);
        const newsData = [];
        $('.gsc-result').each((e, el) => {
            newsData.push({
                title: ($(el).find('a').html()).replace(/(<([^>]+)>)/gi, ''),
                url: $(el).find('a').attr('href'),
                img: $(el).find('img.gs-image').attr('src'),
                date: Tempo.prototype.convertDate(($(el).find('.gsc-table-result').find('.gs-bidi-start-align').html()).replace(/(<([^>]+)>)/gi, '').split(' ... '))
            });
        });

        return newsData;
    })
    .catch(err => new Error(err));
}

Tempo.prototype.convertDate = (dateString) => {
    if(dateString[0].toLowerCase().includes('menit yang lalu')){
        return moment().add(dateString[0].replace('menit yang lalu', ''), 'minutes').toISOString();
    }else if(dateString[0].toLowerCase().includes('detik yang lalu')){
        return moment().add(dateString[0].replace('detik yang lalu', ''), 'seconds').toISOString();
    }else if(dateString[0].toLowerCase().includes('jam yang lalu')){
        return moment().add(dateString[0].replace('jam yang lalu', ''), 'hours').toISOString();
    }else if(dateString[0].toLowerCase().includes('hari yang lalu')){
        return moment().add(dateString[0].replace('hari yang lalu', ''), 'days').toISOString();
    }else{
        const dateConverter = new DateConverter(dateString[0]);
        dateString = dateConverter.monthAbbr().dateString
    }

    const d = moment(dateString, 'DD MMMM YYYY HH:mm');
    return d.toISOString();
}

module.exports = new Tempo();
