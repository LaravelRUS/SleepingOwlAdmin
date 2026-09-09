module.exports = class Url {

    /**
     * @param {String} url
     * @param {String} url_prefix
     * @param {String} url_path
     * @param {String} asset_dir
     */
    constructor(url, url_prefix, url_path, asset_dir) {
        this._url = url
        this._url_prefix = url_prefix
        this._url_path = url_path
        this._asset_dir = asset_dir
    }

    /**
     * Получение якоря
     *
     * @returns {string}
     */
    get hash () {
        return window.location.hash ? window.location.hash.substr(1) : ''
    }

    /**
     * @param {String} path
     */
    set hash(path) {
        if(_.isString(path) && path.length > 0)
            window.history.pushState({ path: this.hash }, document.title, `#${path}`)
        else
            window.history.pushState({ path: this.hash }, document.title, window.location.pathname)
    }

    /**
     * Ссылка на front
     *
     * @returns {String}
     */
    get url() {
        return this._url
    }

    set url(value) {
        throw new Error(`The url property cannot be written.`);
    }

    /**
     * Получение значения url prefix админ панели
     *
     * @returns {String}
     */
    get url_prefix() {
        return this._url_prefix
    }

    set url_prefix(value) {
        throw new Error(`The url_prefix property cannot be written.`);
    }

    /**
     * Получение значения url path админ панели
     *
     * @returns {String}
     */
    get url_path() {
        return this._url_path
    }

    set url_path(value) {
        throw new Error(`The url_path property cannot be written.`);
    }

    /**
     * Относительный путь до хранения ассетов для текущей темы
     *
     * @returns {String}
     */
    get asset_dir() {
        return this._asset_dir
    }

    set asset_dir(value) {
        throw new Error(`The asset_dir property cannot be written.`);
    }

    /**
     * Генерация ссылки на asset файл для текущей темы
     *
     * @param {String} path относительный путь до файла
     * @param {Object} query (Опционально) параметры для генерации query string {foo: bar, baz: bar} = ?foo=bar&baz=bar
     * @returns {String}
     */
    asset(path, query) {
        return this.app(
            this.asset_dir + '/' + _.trimStart(path, '/'),
            query
        );
    }

    /**
     * Генерация admin ссылки
     *
     * @param {String} path относительный путь
     * @param {Object} query (Опционально) параметры для генерации query string {foo: bar, baz: bar} = ?foo=bar&baz=bar
     * @returns {String}
     */
    admin(path, query) {
        return this.app(
            this.url_prefix + '/' + _.trimStart(path, '/'),
            query
        )
    }

    /**
     * Генерация upload ссылки
     *
     * @param {String} path относительный путь
     * @param {Object} query (Опционально) параметры для генерации query string {foo: bar, baz: bar} = ?foo=bar&baz=bar
     * @returns {String}
     */
    upload(path, query) {
        return this._buildUrl(
            this.url + '/' + _.trimStart(path, '/'),
            query
        );
    }

    /**
     * Генерация front ссылки
     *
     * @param {String} path относительный путь
     * @param {Object} query (Опционально) параметры для генерации query string {foo: bar, baz: bar} = ?foo=bar&baz=bar
     * @returns {String}
     */
    app(path, query) {
        return this._buildUrl(
            this.url + '/' + _.trimStart(path, '/'),
            query
        );
    }

    /**
     *
     * @param query
     * @return {Object} query (Опционально) параметры для генерации query string {foo: bar, baz: bar} = ?foo=bar&baz=bar
     */
    query(query) {
        window.location.href = window.location.href.split("?")[0] + '?' + this._serialize(query)
    }

    _buildUrl(url, query) {
        if(_.isObject(query)) {
            query = this._serialize(query)

            if (query.length) {
                url += `?${query}`
            }
        }

        return url;
    }

    _serialize(query, prefix) {
        let str = [], p;
        for (p in query) {
            if (query.hasOwnProperty(p)) {
                let k = prefix ? prefix + "[" + p + "]" : p, v = query[p];
                str.push((!_.isNull(v) && _.isObject(v)) ?
                    this._serialize(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
        return str.join("&");
    }
}
