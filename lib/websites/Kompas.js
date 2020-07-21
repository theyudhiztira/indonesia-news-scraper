'use_strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');
const _ = require('lodash');

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
                // $(el).find('header').find('.simple-share').children().next().children().remove('i');
                newsData.push({
                    title: $(el).find('a.gs-title').html().replace(/(<([^>]+)>)/ig, ''),
                    url: $(el).find('a.gs-title').data('ctorig'),
                    img: $(el).find('img.gs-image').attr('src'),
                    date: null
                });
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