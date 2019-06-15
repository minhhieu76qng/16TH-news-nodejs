var moment = require('moment');

module.exports = {
    toSQLDateTimeString : date => {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },

    toDateString : date => {
        return moment(date).format('DD/MM/YYYY');
    },

    toDateTimeString : date => {
        return moment(date).format('DD/MM/YYYY HH:mm');
    },

    getBeginOfWeek : () => {
        let now = new Date();

        let day = now.getDay();

        let beginDate = now.getDate() - day - (day === 0? 6 : -1);

        return new Date(now.setDate(beginDate));
    }
}