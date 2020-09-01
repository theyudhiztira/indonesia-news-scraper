class DateConverter {
    constructor(dateString) {
        this.dateString = dateString;
    }

    monthAbbr() {
        this.dateString = this.dateString
            .replace(/Jan/g, 'January')
            .replace(/Feb/g, 'February')
            .replace(/Mar/g, 'March')
            .replace(/Apr/g, 'April')
            .replace(/Mei/g, 'May')
            .replace(/Ag(s|u)/g, 'August')
            .replace(/Sep/g, 'September')
            .replace(/Okt/g, 'October')
            .replace(/Nov/g, 'November')
            .replace(/Dec/g, 'December');
        return this;
    }

    monthFull() {
        this.dateString = this.dateString
            .replace(/Januari/g, 'January')
            .replace(/Februari/g, 'February')
            .replace(/Maret/g, 'March')
            .replace(/April/g, 'April')
            .replace(/Mei/g, 'May')
            .replace(/Juni/g, 'June')
            .replace(/Juli/g, 'July')
            .replace(/Agustus/g, 'August')
            .replace(/September/g, 'September')
            .replace(/Oktober/g, 'October')
            .replace(/November/g, 'November')
            .replace(/Desember/g, 'December');
        return this;
    }

    day() {
        this.dateString = this.dateString
            .replace(/Senin/g, 'Monday')
            .replace(/Selasa/g, 'Tuesday')
            .replace(/Rabu/g, 'Wednesday')
            .replace(/Kamis/g, 'Thursday')
            .replace(/Jumat/g, 'Friday')
            .replace(/Sabtu/g, 'Saturday')
            .replace(/Minggu/g, 'Sunday');
        return this;
    }

    wib() {
        this.dateString = this.dateString
            .replace('WIB', '')
            .replace(/Selasa/g, 'Tuesday')
            .replace(/Rabu/g, 'Wednesday')
            .replace(/Kamis/g, 'Thursday')
            .replace(/Jumat/g, 'Friday')
            .replace(/Sabtu/g, 'Saturday')
            .replace(/Minggu/g, 'Sunday');
        return this;
    }

    comma() {
        this.dateString = this.dateString.replace(',', '');
        return this;
    }
}

module.exports = DateConverter;
