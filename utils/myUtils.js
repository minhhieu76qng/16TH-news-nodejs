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
    }
}