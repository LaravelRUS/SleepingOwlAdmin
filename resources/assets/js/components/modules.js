module.exports = {
    _modules: {},
    add (module, callback, priority, events) {
        if (!_.isFunction(callback)) {
            Admin.log('[Modules] Module ' + module + ' not added. You need to specify callback');
            return this;
        }

        this._modules[module] = {
            name: module,
            callback: callback,
            priority: priority || 0
        };

        if(_.isString(events)) {
            Admin.Events.on(events, callback)
        } else if (_.isArray(events)) {
            _.each(events, function(event) {
                Admin.Events.on(event, callback)
            })
        }

        return this;
    },
    call (name) {
        _.each(this._modules, (module, index) => {
            if (_.isArray(name) && _.indexOf(name, index) != -1)
                module.callback();
            else if (name == index)
                module.callback();
        })
    },
    init () {
        _.each(_.sortBy(this._modules, function (module) {
            return module.priority
        }), (module, name) => {
            try {
                module.callback();
            } catch (e) {
                Admin.log('[Modules] Error with loading module ' + name);
            }
        })
    }
}