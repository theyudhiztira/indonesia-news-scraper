'use_strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');

const Viva = function(){};
Viva.prototype.source = 'Viva';
Viva.prototype.baseUrl = 'https://www.viva.co.id/search?q=';

Viva.prototype.headless = true;

Viva.prototype.scrap = (query = null) => {
    let url = Viva.prototype.baseUrl;
    if(!query){
        throw new Error('Please provide a keyword!');
    }
    url+=`${query}&type=all`;

    return puppeteer
    .launch({headless: Viva.prototype.headless})
    .then(browser => browser.newPage())
    .then(page => {
        return page.goto(url).then(() => {
            return page.content();
        });
    })
    .then(html => {
        const $ = cheerio.load(html);
        const newsData = [];
        $('#load_content').find('li').each((e, el) => {
            newsData.push({
                title: $(el).find('.title-content').find('h3').html(),
                url: $(el).find('.title-content').attr('href'),
                img: $(el).find('.flex_thumb').find('img').attr('src'),
                date: Viva.prototype.convertDate($(el).find('.date').html())
            })
        });

        return newsData;
    })
    .catch(err => new Error(err));
}

Viva.prototype.convertDate = (dateString) => {
    dateString = dateString.replace('WIB', '');
    dateString = dateString.replace(/Senin/g, 'Monday');
    dateString = dateString.replace(/Selasa/g, 'Tuesday');
    dateString = dateString.replace(/Rabu/g, 'Wednesday');
    dateString = dateString.replace(/Kamis/g, 'Thursday');
    dateString = dateString.replace(/Jumat/g, 'Friday');
    dateString = dateString.replace(/Sabtu/g, 'Saturday');
    dateString = dateString.replace(/Minggu/g, 'Sunday');

    dateString = dateString.replace(/Januari/g, 'January');
    dateString = dateString.replace(/Februari/g, 'February');
    dateString = dateString.replace(/Maret/g, 'March');
    dateString = dateString.replace(/April/g, 'April');
    dateString = dateString.replace(/Mei/g, 'May');
    dateString = dateString.replace(/Juni/g, 'June');
    dateString = dateString.replace(/Juli/g, 'July');
    dateString = dateString.replace(/Agustus/g, 'August');
    dateString = dateString.replace(/September/g, 'September');
    dateString = dateString.replace(/Oktober/g, 'October');
    dateString = dateString.replace(/November/g, 'November');
    dateString = dateString.replace(/Desember/g, 'December');

    let d = moment(dateString, 'DD MMMM YYYY HH:mm');
    return d.toISOString();
}

module.exports = new Viva();