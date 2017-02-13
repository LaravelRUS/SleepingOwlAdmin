module.exports = function () {

    var events = {},
        empty = []

    return {

        /**
         * Listen to events
         *
         * @param {String} type
         * @param {Function} func
         * @param {String} ctx
         */
        on: function (type, func, ctx) {
            (events[type] = events[type] || []).push([func, ctx])
        },

        /**
         * Stop listening to event / specific callback
         *
         * @param {String} type
         * @param {Function} func
         */
        off: function (type, func) {
            type || (events = {})

            let list = events[type] || empty,
                i = list.length = func ? list.length : 0

            while (i--) func == list[i][0] && list.splice(i, 1)
        },

        /**
         * Send event, callbacks will be triggered
         *
         * @param {String} type
         */
        fire: function (type) {
            let e = events[type] || empty, list = e.length > 0
                ? e.slice(0, e.length)
                : e, i = 0, j

            while (j = list[i++]) j[0].apply(j[1], empty.slice.call(arguments, 1))
        }
    }
}()