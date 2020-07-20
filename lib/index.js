'use strict';

const Detik = require('./websites/Detik.js');
const Antara = require('./websites/Antara.js');

Antara.scrap("kasus covid").then(res => {
    console.log(res)
})

module.exports = {
    Detik: Detik,
    Antara: Antara
}