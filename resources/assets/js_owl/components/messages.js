module.exports = (function () {

    return {

        /**
         * Error message output
         *
         * @param {String} title
         * @param {String} message
         * @returns {*}
         */
        error(title, message) {
            return this.message(title, message, "error")
        },

        /**
         * Success message output
         *
         * @param {String} title
         * @param {String} message
         * @returns {*}
         */
        success(title, message) {
            return this.message(title, message, "success")
        },

        /**
         * Message output
         *
         * @param {String} title
         * @param {String} message
         * @param {String} icon Message icon (error, success)
         * @returns {*}
         */
        message(title, message, icon) {
            return Swal.fire(title, message, icon || 'success')
        },

        /**
         * Confirmation message
         *
         * @param {String} title
         * @param {String} message
         * @param {Object} id
         */
        confirm(title, message, id) {

            let settings = {
                title: title,
                text: message || '',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3c8dbc',
                cancelButtonColor: '#d33',
                confirmButtonText: trans('lang.button.yes'),
                cancelButtonText: trans('lang.button.cancel')
            };



            Admin.Events.fire("datatables::confirm::init", settings, id);

            return Swal.fire(settings)
        },

        /**
         * Displaying a message with an input field
         *
         * @param {String} title
         * @param {String} message
         * @param {Function} callback Code executed when confirmation
         * @param {String} inputPlaceholder Placeholder
         * @param {String} inputValue Default value in input field
         * @param {String} imageUrl Show Image on this link
         */
        prompt(title, message, inputPlaceholder, inputValue, imageUrl) {
            return Swal.fire({
                title: title,
                text: message || '',
                input: 'text',
                showCancelButton: true,
                inputPlaceholder: inputPlaceholder || '',
                inputValue: inputValue || '',
                imageUrl: imageUrl || '',
                confirmButtonText: trans('lang.button.yes'),
                cancelButtonText: trans('lang.button.cancel')
            })
        },
    }

})()
