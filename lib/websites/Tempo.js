'use_strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');

class Tempo {
    constructor(){
        this.source = 'Tempo';
        this.baseUrl = 'https://www.tempo.co/search?q=';
    }

    scrap = (query = null) => {
        var url = this.baseUrl;
        if(query){
            url+= query;
        }else{
            url+= 'indonesia';
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
            $('.gsc-result').each((e, el) => {
                newsData.push({
                    title: ($(el).find('a').html()).replace(/(<([^>]+)>)/gi, ''),
                    url: $(el).find('a').attr('href'),
                    img: $(el).find('img.gs-image').attr('src'),
                    // // date: this.convertDate($(el).find('.txt_subkanal').find('h6').html())
                    date: this.convertDate(($(el).find('.gsc-table-result').find('.gs-bidi-start-align').html()).replace(/(<([^>]+)>)/gi, '').split(' ... '))
                });
            });

            return newsData;
        })
        .catch(console.error);
    }

    convertDate = (dateString) => {
        if(dateString[0].toLowerCase().includes('menit yang lalu')){
            return moment().add(dateString[0].replace('menit yang lalu', ''), 'minutes').toISOString();
        }else if(dateString[0].toLowerCase().includes('detik yang lalu')){
            return moment().add(dateString[0].replace('detik yang lalu', ''), 'seconds').toISOString();
        }else if(dateString[0].toLowerCase().includes('jam yang lalu')){
            return moment().add(dateString[0].replace('jam yang lalu', ''), 'hours').toISOString();
        }else if(dateString[0].toLowerCase().includes('hari yang lalu')){
            return moment().add(dateString[0].replace('hari yang lalu', ''), 'days').toISOString();
        }

        var d = moment(dateString, 'DD MMMM YYYY HH:mm');
        return d.toISOString();
    }
}

module.exports = new Tempo();