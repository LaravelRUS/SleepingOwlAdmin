module.exports = function () {
    var events = {}, empty = [];

    return {
        /**
         *  On: listen to events
         */
        on: function (type, func, ctx) {
            (events[type] = events[type] || []).push([func, ctx])
        },
        /**
         *  Off: stop listening to event / specific callback
         */
        off: function (type, func) {
            type || (events = {})
            var list = events[type] || empty,
                i = list.length = func ? list.length : 0;
            while (i--) func == list[i][0] && list.splice(i, 1)
        },
        /**
         * Emit: send event, callbacks will be triggered
         */
        fire: function (type) {
            var e = events[type] || empty, list = e.length > 0 ? e.slice(0, e.length) : e, i = 0, j;
            while (j = list[i++]) j[0].apply(j[1], empty.slice.call(arguments, 1))
        }
    }
}()