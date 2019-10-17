module.exports = class ConfigReposirtory {

    constructor(config) {
        this.__data = config || {};
    }

    /**
     * @param {String} key
     * @param {*} def
     * @returns {*}
     */
    get(key, def) {
        return _.get(this.__data, key, def)
    }

    /**
     *
     * @param {String} key
     * @param {*} value
     * @returns {Object}
     */
    set(key, value) {
        return _.set(this.__data, key, value)
    }

    /**
     * Проверка на существование значения
     *
     * @param {String} key
     * @returns {boolean}
     */
    has(key) {
        return _.has(this.__data, key)
    }

    /**
     * Слияние текущего конфига с переданным
     *
     * @param {Object} config
     */
    merge(config) {
        _.merge(this.__data, config)
    }

    /**
     * Получение списка ключей
     *
     * @returns {Array}
     */
    keys () {
        return _.keys(this.__data)
    }

    /**
     * Получение списка всех значений
     *
     * @returns {Object}
     */
    all () {
        return this.__data
    }
}