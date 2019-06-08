module.exports = {
    toSQLDateTimeString : date => {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    }
}