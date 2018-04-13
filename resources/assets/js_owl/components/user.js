module.exports = class User {

    constructor(userId) {
        this.__userId = userId
        this.__data = {};
    }

    isAuthenticated() {
        return _.isInteger(this.id)
    }

    /**
     *
     * @returns {Integer}
     */
    get id() {
        return this.__userId
    }

    set id(value) {
        throw new Error(`The id property cannot be written.`)
    }
}