'use_strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');

class Antara {
    constructor(){
        this.source = 'Antara';
        this.baseUrl = 'https://www.antaranews.com/search';
    }

    scrap = (query = null) => {
        var url = this.baseUrl;
        if(query){
            url+=`?q=${query}`
        }

        return puppeteer
        .launch()
        .then(browser => browser.newPage())
        .then(page => {
            return page.goto(url).then(function () {
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
                    date: this.convertDate($(el).find('header').find('.simple-share').children().next().html())
                });
            });

            return newsData;
        })
        .catch(console.error);
    }

    convertDate = (dateString) => {
        if(dateString.toLowerCase().includes('menit lalu')){
            return moment().add(dateString.replace('menit lalu', ''), 'minutes').toISOString();
        }else if(dateString.toLowerCase().includes('detik lalu')){
            return moment().add(dateString.replace('detik lalu', ''), 'seconds').toISOString();
        }

        var d = moment(dateString, 'DD MMMM YYYY HH:mm');
        return d.toISOString();
    }
}

module.exports = new Antara();