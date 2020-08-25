'use_strict';

const fetch = require('node-fetch');
const moment = require('moment');

const Kompas = function(){};

Kompas.prototype.source = 'Kompas';
Kompas.prototype.baseUrl = 'https://cse.google.com/cse/element/v1?rsz=filtered_cse&num=10&hl=en&source=gcsc&gss=.com&cselibv=26b8d00a7c7a0812&cx=018212539862037696382:-xa61bkyvao&safe=off&cse_tok=AJvRUv2UpW015_VJ2w-42Op5c5w7:1598375214995&sort=&exp=csqr,cc&callback=google.search.cse.api10905';

Kompas.prototype.scrap = (query) => {
    let url = Kompas.prototype.baseUrl;

    if(!query){
        throw new Error('Please provide a keyword!');        
    }

    url+=`&q=${query}`;

    return fetch(url)
    .then(res => { 
        return res.text() 
    })
    .then(body => { 
        return Kompas.prototype.processResult(body);
    })
    .catch(err => {
        console.log(err);
    });
}

Kompas.prototype.processResult = (rawData) => {
    const preparedData = JSON.parse(rawData.substring(35).replace(");", ""));
    const result = [];

    if(preparedData.results){
        let data = preparedData.results;

        data.map(v => {
            result.push(Kompas.prototype.formatResult(v));
        });
    }

    return result;
}

Kompas.prototype.formatResult = (data) => {
    return {
        'title': data.richSnippet.metatags.ogTitle,
        'url': data.url,
        'img': !data.richSnippet.cseImage ? null : data.richSnippet.cseImage.src,
        'date': Kompas.prototype.convertDate(data.richSnippet.metatags.contentPublisheddate)
    };
}

Kompas.prototype.convertDate = (dateString) => {
    return moment(dateString).toISOString();
}

module.exports = new Kompas();