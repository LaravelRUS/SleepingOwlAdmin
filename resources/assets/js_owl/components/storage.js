module.exports = (function () {

    function _prefix(key) {
        return `SleepingOwl::${key}`
    }

    return {

        set(key, value) {
            const obj = _.isString(key) ? { [key]: value } : key
            const keys = _.keys(obj)

            for (let i = 0, len = keys.length; i < len; i++) {
                window.localStorage.setItem(_prefix(keys[i]), obj[keys[i]])
            }
        },

        get(key) {
            const keys = _.isArray(key) ? key : [key]
            const result = {}

            for (let i = 0, len = keys.length; i < len; i++) {
                result[keys[i]] = window.localStorage.getItem(_prefix(keys[i]))
            }

            return _.isArray(key) ? result : result[key]
        }
    }

})()