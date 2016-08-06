module.exports = {
    _filters: [],
    _switchedOn: {},
    _editors: {},
    add (name, switchOnHandler, switchOffHandler, execHandler) {
        if (_.isUndefined(switchOnHandler) || _.isUndefined(switchOffHandler)) {
            Admin.log('System try to add filter without required callbacks.');
            return;
        }

        this._filters.push([
            name,
            switchOnHandler,
            switchOffHandler,
            execHandler
        ]);
    },
    switchOn (textareaId, filter, params) {
        $('#' + textareaId).css('display', 'block');

        if (this._filters.length > 0) {
            let oldFilter = this.get(textareaId);
            let newFilter = null;

            for (let i = 0; i < this._filters.length; i++) {
                if (this._filters[i][0] == filter) {
                    newFilter = this._filters[i];
                    break;
                }
            }

            if (oldFilter !== newFilter) {
                this.switchOff(textareaId);
            }

            try {
                this._switchedOn[textareaId] = newFilter;
                this._editors[textareaId] = newFilter[1](textareaId, params);
                $('#' + textareaId).trigger('wysiwyg:switch:on', this._editors[textareaId]);
            } catch (e) {
                Admin.log(e);
            }
        }
    },
    switchOff (textareaId) {
        let filter = this.get(textareaId);
        try {
            if (filter && typeof(filter[2]) == 'function') {
                filter[2](this._editors[textareaId], textareaId);
            }
            this._switchedOn[textareaId] = null;
            $('#' + textareaId).trigger('wysiwyg:switch:off');
        } catch (e) {
            Admin.log(e);
        }
    },
    get (textareaId) {
        for (let key in this._switchedOn) {
            if (key == textareaId)
                return this._switchedOn[key];
        }
    },
    exec (textareaId, command, data) {
        let filter = this.get(textareaId);

        if (filter && _.isFunction(filter[3]))
            return filter[3](this._editors[textareaId], command, textareaId, data);
    }
}