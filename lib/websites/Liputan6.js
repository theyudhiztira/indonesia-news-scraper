'use_strict';

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const moment = require('moment');

class Antara {
    constructor(){
        this.source = 'Liputan6';
        this.baseUrl = 'https://www.liputan6.com/search';
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
            $('article[class="articles--iridescent-list--item articles--iridescent-list--text-item"]').each((e, el) => {
                var imgUrl = $(el).find('picture').children()[0];
                // $(el).find('header').find('.simple-share').children().next().children().remove('i');
                newsData.push({
                    title: $(el).find('.articles--iridescent-list--text-item__figure-thumbnail-link').attr('title'),
                    url: $(el).find('.articles--iridescent-list--text-item__figure-thumbnail-link').attr('href'),
                    img: (imgUrl.attribs['data-srcset']).split(' 1x, ')[0],
                    date: this.convertDate($(el).find('aside').find('header').children().find('[class="articles--iridescent-list--text-item__time timeago"]').first().attr('datetime'))
                });
            });

            return newsData;
        })
        .catch(console.error);
    }

    convertDate = (dateString) => {
        var d = moment(dateString);
        return d.toISOString();
    }
}

module.exports = new Antara();