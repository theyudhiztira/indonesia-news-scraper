'use_strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');

class Republika {
    constructor(){
        this.source = 'Republika';
        this.baseUrl = 'https://republika.co.id/search/';
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
            $('.item-cari').each((e, el) => {
                newsData.push({
                    title: $(el).find('.txt_subkanal').find('h2').text(),
                    url: $(el).find('.txt_subkanal').find('h2').children().attr('href'),
                    img: $(el).find('.img_subkanal').find('.lazy').attr('src'),
                    date: this.convertDate($(el).find('.txt_subkanal').find('h6').html())
                });
            });

            return newsData;
        })
        .catch(console.error);
    }

    convertDate = (dateString) => {
        dateString = dateString.replace('WIB', '');

        var d = moment(dateString, 'DD MMMM YYYY HH:mm');
        return d.toISOString();
    }
}

module.exports = new Republika();