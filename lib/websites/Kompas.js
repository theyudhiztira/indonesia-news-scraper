'use_strict';

const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const moment = require("moment");

const Kompas = function(){};

Kompas.prototype.source = 'Kompas';
Kompas.prototype.baseUrl = 'https://www.kompas.com/tag/';

Kompas.prototype.headless = true;

Kompas.prototype.scrap = (query) => {
    let url = Kompas.prototype.baseUrl;

    if(!query){
        throw new Error('Please provide a keyword!');        
    }

    url+=`${query}?sort=desc`;

    return puppeteer
    .launch({headless: Kompas.prototype.headless})
    .then(browser => browser.newPage())
    .then(page => {
        return page.goto(url).then(() => {
            return page.content();
        });
    })
    .then(html => {
        const $ = cheerio.load(html);
        const newsData = [];
        $('.article__list').each((e, el) => {
            newsData.push({
                title: $(el).find('.article__link').html(),
                url: $(el).find('.article__link').attr('href'),
                img: $(el).find('.article__asset').find('a').find('img').attr('src'),
                // date: Kompas.prototype.convertDate($(el).find('.article__date').html())
                date: Kompas.prototype.convertDate($(el).find('.article__date').html())
            })
        });

        return newsData;
    })
    .catch(err => new Error(err));
}

Kompas.prototype.convertDate = (dateString) => {
    dateString = dateString.replace(' WIB', '');
    dateString = dateString.replace(',', '');

    let d = moment(dateString, 'DD/MM/YYY HH:mm');
    return d.toISOString();
}

module.exports = new Kompas();