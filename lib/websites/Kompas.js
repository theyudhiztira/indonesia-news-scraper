'use_strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');

class Kompas {
    constructor(){
        this.source = 'Kompas';
        this.baseUrl = 'https://search.kompas.com/search';
    }

    scrap = (query = null) => {
        var url = this.baseUrl;
        if(query){
            url += `?q=${query}`
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
            $('.gsc-webResult').each((e, el) => {
                var rawTitle = $(el).find('a.gs-title').html();
                if(rawTitle){
                    newsData.push({
                        title: rawTitle === null ? null : rawTitle.replace(/(<([^>]+)>)/ig, ''),
                        url: $(el).find('a.gs-title').data('ctorig'),
                        img: $(el).find('img.gs-image').attr('src'),
                        date: null
                    });
                }
            });

            return newsData;
        })
        .catch(console.error);
    }

    convertDate = (dateString) => {
        var d = moment(dateString, 'DD MMMM YYYY HH:mm');
        return d.toISOString();
    }
}

module.exports = new Kompas();