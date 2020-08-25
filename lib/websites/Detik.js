'use_strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');

const Detik = function(){};

Detik.prototype.source = 'Detik';
Detik.prototype.baseUrl = 'https://www.detik.com/search/searchnews';

Detik.prototype.convertDate = (dateString) => {
    dateString = dateString.replace('WIB', '');
    dateString = dateString.replace(/Senin/g, 'Monday');
    dateString = dateString.replace(/Selasa/g, 'Tuesday');
    dateString = dateString.replace(/Rabu/g, 'Wednesday');
    dateString = dateString.replace(/Kamis/g, 'Thursday');
    dateString = dateString.replace(/Jumat/g, 'Friday');
    dateString = dateString.replace(/Sabtu/g, 'Saturday');
    dateString = dateString.replace(/Minggu/g, 'Sunday');

    dateString = dateString.replace(/Jan/g, 'January');
    dateString = dateString.replace(/Feb/g, 'February');
    dateString = dateString.replace(/Mar/g, 'March');
    dateString = dateString.replace(/Apr/g, 'April');
    dateString = dateString.replace(/Mei/g, 'May');
    dateString = dateString.replace(/Jun/g, 'June');
    dateString = dateString.replace(/Jul/g, 'July');
    dateString = dateString.replace(/Agu/g, 'August');
    dateString = dateString.replace(/Sep/g, 'September');
    dateString = dateString.replace(/Okt/g, 'October');
    dateString = dateString.replace(/Nov/g, 'November');
    dateString = dateString.replace(/Dec/g, 'December');

    let d = moment(dateString, 'DD MMMM YYYY HH:mm');
    return d.toISOString();
}

Detik.prototype.scrap = (query = null) => {
    let url = Detik.prototype.baseUrl;

    if (!query){
        throw new Error('Please provide a keyword!');
    }

    url += `?query=${query}`;

    return puppeteer
    .launch()
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