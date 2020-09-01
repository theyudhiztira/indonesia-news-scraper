'use_strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');
const DateConverter = require("../helpers/DateConverter")

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
    const dateConverter = new DateConverter(dateString);
    dateString = dateConverter.wib().day().monthFull().dateString

    const d = moment(dateString, 'DD MMMM YYYY HH:mm');
    return d.toISOString();
}

module.exports = new Viva();
