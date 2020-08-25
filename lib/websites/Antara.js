'use_strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');

const Antara = function(){};

Antara.prototype.source = 'Antara';
Antara.prototype.baseUrl = 'https://www.antaranews.com/search';

Antara.prototype.scrap = (query = null) => {
    let url = Antara.prototype.baseUrl;

    if(!query){
        throw new Error('Please provide a keyword!');        
    }

    url+=`?q=${query}`;
    
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
        $('.simple-big').each((e, el) => {
            $(el).find('header').find('.simple-share').children().next().children().remove('i');
            newsData.push({
                title: $(el).find('header').children().children().html(),
                url: $(el).find('header').find('h3').children().attr('href'),
                img: $(el).find('.simple-thumb').find('picture').find('img').data('src'),
                date: Antara.prototype.convertDate(($(el).find('header').find('.simple-share').children().next().html()).substring(1))
            });
        });

        return newsData;
    })
    .catch(err => new Error(err));
}

Antara.prototype.convertDate = (dateString) => {
    if(dateString.toLowerCase().includes('menit lalu')){
        return moment().add(dateString.replace('menit lalu', ''), 'minutes').toISOString();
    }else if(dateString.toLowerCase().includes('detik lalu')){
        return moment().add(dateString.replace('detik lalu', ''), 'seconds').toISOString();
    }else{
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
    }

    let d = moment(dateString, 'DD MMMM YYYY HH:mm');
    return d.toISOString();
}

module.exports = new Antara();