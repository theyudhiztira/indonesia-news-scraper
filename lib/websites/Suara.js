'use_strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');

const Suara = function(){};
Suara.prototype.source = 'Suara';
Suara.prototype.baseUrl = 'https://www.suara.com/search?q=';

Suara.prototype.headless = true;

Suara.prototype.scrap = (query = null) => {
    let url = Suara.prototype.baseUrl;
    if(!query){
        throw new Error('Please provide a keyword!');
    }
    url+=`${query}#gsc.tab=0&gsc.q=${query}&gsc.sort=date`;

    return puppeteer
    .launch({headless: Suara.prototype.headless})
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
                title: ($(el).find('a.gs-title').html()).replace(/(<([^>]+)>)/gi, ''),
                url: $(el).find('a').attr('href'),
                img: $(el).find('img.gs-image').attr('src'),
                date: Suara.prototype.convertDate(($(el).find('.gsc-table-result').find('.gs-bidi-start-align').html()).replace(/(<([^>]+)>)/gi, '').split(' ... ') ? ($(el).find('.gsc-table-result').find('.gs-bidi-start-align').html()).replace(/(<([^>]+)>)/gi, '').split(' ... ') : ($(el).find('.gsc-table-result').find('.gs-bidi-start-align').html()).replace(/(<([^>]+)>)/gi, '').split('...'))
            });
        });

        return newsData;
    })
    .catch(err => new Error(err));
}

Suara.prototype.convertDate = (dateString) => {
    if (dateString[0].toLowerCase().includes('menit yang lalu')) {
        return moment().add(dateString[0].replace('menit yang lalu', ''), 'minutes').toISOString();
    } else if (dateString[0].toLowerCase().includes('detik yang lalu')) {
        return moment().add(dateString[0].replace('detik yang lalu', ''), 'seconds').toISOString();
    } else if (dateString[0].toLowerCase().includes('jam yang lalu')) {
        return moment().add(dateString[0].replace('jam yang lalu', ''), 'hours').toISOString();
    } else if (dateString[0].toLowerCase().includes('hari yang lalu')) {
        return moment().add(dateString[0].replace('hari yang lalu', ''), 'days').toISOString();
    }else{
        dateString = dateString[0];
        dateString = dateString.replace(/Jan/g, 'January');
        dateString = dateString.replace(/Feb/g, 'February');
        dateString = dateString.replace(/Mar/g, 'March');
        dateString = dateString.replace(/Apr/g, 'April');
        dateString = dateString.replace(/Mei/g, 'May');
        dateString = dateString.replace(/Ags/g, 'August');
        dateString = dateString.replace(/Sep/g, 'September');
        dateString = dateString.replace(/Okt/g, 'October');
        dateString = dateString.replace(/Nov/g, 'November');
        dateString = dateString.replace(/Dec/g, 'December');
    }

    var d = moment(dateString, 'DD MMMM YYYY HH:mm');
    return d.toISOString();
}

module.exports = new Suara();