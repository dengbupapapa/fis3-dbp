class addFilter {

    constructor(env) {
        this.init(env);
    }

    init(env) {

        env.addFilter('fontSize', function(data, length) {
            if (!!!data) return data;
            return data.length > length ? data.slice(0, length) + '...' : data;
        });

        env.addFilter('dateTimeFormat', function(timestamp) {
            if (!!!timestamp) {
                return ''
            }
            var date = new Date(timestamp * 1000),
                year = date.getFullYear(),
                month = timeFix(date.getMonth() + 1),
                day = timeFix(date.getDate()),
                hours = timeFix(date.getHours()),
                minutes = timeFix(date.getMinutes()),
                seconds = timeFix(date.getSeconds());

            return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
        });

        env.addFilter('dateFormat', function(timestamp) {
            if (!!!timestamp) {
                return ''
            }
            var date = new Date(timestamp),
                year = date.getFullYear(),
                month = timeFix(date.getMonth() + 1),
                day = timeFix(date.getDate());
            return year + '-' + month + '-' + day
        });

    }

}

module.exports = addFilter