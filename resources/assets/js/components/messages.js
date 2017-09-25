module.exports = (function () {

    return {

        /**
         * Вывод сообщения об ошибке
         *
         * @param {String} title заголовок
         * @param {String} message текст
         * @returns {*}
         */
        error(title, message) {
            return this.message(title, message, "error")
        },

        /**
         * Вывод Success сообщения
         * @param {String} title заголовок
         * @param {String} message текст
         * @returns {*}
         */
        success(title, message) {
            return this.message(title, message, "success")
        },

        /**
         * Вывод сообщения
         *
         * @param {String} title заголовок
         * @param {String} message текст
         * @param {String} type Тип сообщения (error, success)
         * @returns {*}
         */
        message(title, message, type) {
            return swal(title, message, type || 'success')
        },

        /**
         * Вывод сообщения с подтверждением
         *
         * @param {String} title заголовок
         * @param {String} message текст
         * @param {Object} id
         */
        confirm(title, message, id) {

            let settings = {
                title: title,
                text: message || '',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3c8dbc',
                cancelButtonColor: '#d33',
                confirmButtonText: trans('lang.button.yes'),
                cancelButtonText: trans('lang.button.cancel')
            };



            Admin.Events.fire("datatables::confirm::init", settings, id);

            return swal(settings)
        },

        /**
         * Вывод сообщения с полем ввода
         *
         * @param {String} title
         * @param {String} message
         * @param {Function} callback Код выполняемый при подтверждении
         * @param {String} inputPlaceholder Вспомогательный текст для поля ввода
         */
        prompt(title, message, inputPlaceholder) {
            return swal({
                title: title,
                text: message || '',
                input: 'text',
                showCancelButton: true,
                closeOnConfirm: false,
                inputPlaceholder: inputPlaceholder || '',
                cancelButtonText: trans('lang.button.cancel')
            })
        },
    }

})()