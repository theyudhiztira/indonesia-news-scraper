'use_strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');
const _ = require('lodash')

class Detik {
    constructor(){
        this.source = 'Detik';
        this.baseUrl = 'https://www.detik.com/search/searchnews';
    }

    scrap = (query = null) => {
        var url = this.baseUrl;
        if(query){
            url+=`?query=${query}`
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
            $('article').each((e, el) => {
                $(el).find('.date').children().remove('.category');

                newsData.push({
                    title: $(el).find('.title').text(),
                    url: $(el).find('a').attr('href'),
                    img: $(el).find('img').attr('src'),
                    date: this.convertDate($(el).find('.date').html())
                });
            });

            return newsData;
        })
        .catch(console.error);
    }

    convertDate = (dateString) => {
        dateString = dateString.replace('WIB', '');
        dateString = dateString.replace(/Senin/g, 'Monday');
        dateString = dateString.replace(/Selasa/g, 'Tuesday');
        dateString = dateString.replace(/Rabu/g, 'Wednesday');
        dateString = dateString.replace(/Kamis/g, 'Thursday');
        dateString = dateString.replace(/Jumat/g, 'Friday');
        dateString = dateString.replace(/Sabtu/g, 'Saturday');
        dateString = dateString.replace(/Minggu/g, 'Sunday');

        var d = moment(dateString, 'DD MMMM YYYY HH:mm');
        return d.toISOString();
    }
}

module.exports = new Detik();