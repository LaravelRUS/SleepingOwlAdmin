module.exports = (function() {

    var wysiwyg = [],
        switchedOn = {},
        editors = {}

    return {

        add (name, switchOnHandler, switchOffHandler, execHandler) {
            this.register(name, switchOnHandler, switchOffHandler, execHandler)
        },

        /**
         * Регистрация нового редактора
         *
         * @param {String} name название редактора
         * @param {Function} switchOnHandler код выполняемый при подключении
         * @param {Function} switchOffHandler код выполняемый при отключении
         * @param {Function} execHandler код выполняемый при вызове команды редактора
         * @returns {boolean}
         */
        register (name, switchOnHandler, switchOffHandler, execHandler) {
            if (_.isUndefined(switchOnHandler) || _.isUndefined(switchOffHandler)) {
                Admin.log('System try to add filter without required callbacks.', 'Wysiwyg')
                return false
            }

            wysiwyg.push([
                name,
                switchOnHandler,
                switchOffHandler,
                execHandler
            ])
        },

        /**
         * Получение объекта подключеного редактора по ID инпута в котором он подключен
         *
         * @param {String} textareaId
         * @returns {Object}
         */
        get (textareaId) {
            for (let key in switchedOn) {
                if (key == textareaId)
                    return switchedOn[key]
            }
        },

        /**
         * Подключение редактора к инпуту по ID
         *
         * @param {String} textareaId
         * @param {String} name ключ подключаемого редактора
         * @param {Object} params Дполнительные параметры
         */
        switchOn (textareaId, name, params) {
            $(`#${textareaId}`).css('display', 'block')

            if (wysiwyg.length > 0) {
                let oldFilter = this.get(textareaId),
                    newFilter = null

                for (let i = 0; i < wysiwyg.length; i++) {
                    if (wysiwyg[i][0] == name) {
                        newFilter = wysiwyg[i]
                        break
                    }
                }

                if (oldFilter !== newFilter) {
                    this.switchOff(textareaId)
                }

                try {
                    switchedOn[textareaId] = newFilter
                    editors[textareaId] = newFilter[1](textareaId, params)

                    Admin.Events.fire('wysiwyg:switchOn', editors[textareaId])
                } catch (e) {
                    Admin.log(e)
                    console.log('textareaId = ' + textareaId);
                }
            }
        },

        /**
         * Выключение редактора по ID инпута в котором он подключен
         *
         * @param {String} textareaId
         */
        switchOff (textareaId) {
            let filter = this.get(textareaId)

            try {
                if (filter && _.isFunction(filter[2])) {
                    filter[2](editors[textareaId], textareaId)
                }

                switchedOn[textareaId] = null
                Admin.Events.fire('wysiwyg:switchOff', textareaId)

            } catch (e) {
                Admin.log(e, 'Wysiwyg')
            }
        },

        /**
         * Выполение команды в редакторе по ID инпута в котором он подключен
         *
         * @param {String} textareaId
         * @param {String} command
         * @param {*} data
         * @returns {*}
         */
        exec (textareaId, command, data) {
            let filter = this.get(textareaId)

            if (filter && _.isFunction(filter[3])) {
                Admin.Events.fire('wysiwyg:exec', command, textareaId, data)
                return filter[3](editors[textareaId], command, textareaId, data)
            }
        }
    }

})()
