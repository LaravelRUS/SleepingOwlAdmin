import Config from "./config";
import Url from "./url";
import User from "./user";

export default class Admin {
    constructor(token, config) {
        this.__token = token
        this.__config = new Config(config)
        this.__user = new User(this.Config.get('user_id'))
        this.__url = new Url(
            this.Config.get('url'),
            this.Config.get('url_prefix', 'admin'),
            this.Config.get('url_path', 'admin'),
            this.Config.get('template.asset_dir')
        )
    }

    /**
     * @returns {User}
     */
    get User() {
        return this.__user
    }

    /**
     * @returns {String}
     */
    get token() {
        return this.__token
    }

    /**
     * @returns {String}
     */
    get locale() {
        return this.Config.get('locale')
    }

    /**
     * @returns {boolean}
     */
    get debug() {
        return this.Config.get('debug')
    }

    /**
     * @returns {String}
     */
    get env() {
        return this.Config.get('env')
    }

    /**
     * @returns {ConfigReposirtory}
     */
    get Config() {
        return this.__config
    }

    /**
     * @returns {Url}
     */
    get Url() {
        return this.__url
    }

    log(error, module) {
        if (this.debug)
            console.log(`[${module || 'SleepingOwl Framework'}]: ${error}`)
    }

    set token(value) {
        throw new Error(`The token property cannot be written.`)
    }

    set debug(value) {
        throw new Error(`The debug property cannot be written.`)
    }

    set env(value) {
        throw new Error(`The env property cannot be written.`)
    }

    set locale(value) {
        throw new Error(`The locale property cannot be written.`)
    }

    set Config(value) {
        throw new Error(`The Config property cannot be written.`)
    }

    set Url(value) {
        throw new Error(`The Url property cannot be written.`)
    }

    set User(value) {
        throw new Error(`The User property cannot be written.`)
    }
}
