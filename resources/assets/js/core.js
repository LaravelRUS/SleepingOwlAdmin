window.Admin = {
    Controllers: {
        _controllers: [],
        add: function (rout, callback) {
            if (typeof(callback) != 'function')
                return this;

            if (typeof(rout) == 'object')
                for (var i = 0; i < rout.length; i++)
                    this._controllers.push([rout[i], callback]);
            else if (typeof(rout) == 'string')
                this._controllers.push([rout, callback]);

            return this;
        },
        call: function () {
            var body_id = $('body:first').data('id');
            for (var i = 0; i < this._controllers.length; i++)
                if (body_id == this._controllers[i][0])
                    this._controllers[i][1](this._controllers[i][0]);
        }
    },
    Components: {
        _elements: [],
        _modules: [],
        add: function (module, callback, priority) {
            if (typeof(callback) != 'function')
                return this;

            this._elements.push([module, callback, priority || 0]);
            return this;
        },
        addModule: function (module, callback, priority) {
            if (typeof(callback) != 'function')
                return this;

            this._modules.push([module, callback, priority || 0]);
            return this;
        },
        call: function (module) {
            for (var i = 0; i < this._elements.length; i++) {
                var elm = this._elements[i];
                if (_.isArray(module) && _.indexOf(module, elm[0]) != -1)
                    elm[1]();
                else if (module == elm[0])
                    elm[1]();
            }
        },
        init: function (module) {
            this._elements = _.sortBy(this._elements, 2);
            this._modules = _.sortBy(this._modules, 2);

            for (i in this._elements) {
                var elm = this._elements[i];

                try {
                    if (!module)
                        elm[1]();
                    else if (_.isArray(module) && _.indexOf(module, elm[0]) != -1)
                        elm[1]();
                    else if (module == elm[0])
                        elm[1]();
                } catch (e) {
                    console.log(elm[0], e);
                }
            }

            var modules = [];
            $('[data-module]').each(function () {
                modules.push($(this).data('module'));
            });

            modules = _.uniq(modules);
            for (i in this._modules) {
                var module = this._modules[i],
                    moduleName = module[0];

                if (_.indexOf(modules, moduleName) != -1) {
                    module[1]();
                }
            }
        }
    },
    Messages: {
        parse: function ($messages, $type) {
            for (text in $messages) {
                if (text == '_external') {
                    this.parse($messages[text], $type);
                    continue;
                }

                this.show($messages[text], $type);
            }
        },
        show: function (msg, type, icon) {
            if (!type) type = 'success';

            window.top.noty({
                layout: 'topRight',
                type: type,
                icon: icon || 'fa fa-ok',
                text: decodeURIComponent(msg)
            });
        },
        error: function (message) {
            this.show(message, 'error');
        }
    },
    Loader: {
        counter: 0,
        getLastId: function () {
            return this.counter;
        },
        init: function (container, message) {
            if (container !== undefined && !(container instanceof jQuery)) {
                container = $(container);
            }
            else if (container === undefined) {
                container = $('body');
            }

            ++this.counter;

            var $loader = $('<div class="_loader_container"><span class="_loader_preloader" /></div>');

            if (message !== undefined) {
                if (message instanceof jQuery)
                    $loader.append(message);
                else
                    $loader.append('<span class="_loader_message">' + message + '</span>');
            }

            return $loader
                .appendTo(container)
                .css({
                    width: container.outerWidth(true),
                    height: container.outerHeight(true),
                    top: container.offset().top - $(window).scrollTop(),
                    left: container.offset().left - $(window).scrollLeft()
                })
                .prop('id', 'loader' + this.getLastId());
        },
        show: function (container, message, speed) {
            var speed = speed || 500;

            this.init(container, message).fadeTo(speed, 0.7);
            return this.counter;
        },
        hide: function (id) {
            if (!id)
                cont = $('._loader_container');
            else
                cont = $('#loader' + id);

            cont.stop().fadeOut(400, function () {
                $(this).remove();
            });
        }
    },
    WYSIWYG: {
        _filters: [],
        _switchedOn: {},
        _editors: {},
        add: function (name, switchOnHandler, switchOffHandler, execHandler) {
            if (switchOnHandler == undefined || switchOffHandler == undefined) {
                Admin.Messages.error('System try to add filter without required callbacks.');
                return;
            }
            this._filters.push([
                name,
                switchOnHandler,
                switchOffHandler,
                execHandler
            ]);
        },
        switchOn: function (textareaId, filter, params) {
            $('#' + textareaId).css('display', 'block');
            if (this._filters.length > 0) {
                var oldFilter = this.get(textareaId);
                var newFilter = null;

                for (var i = 0; i < this._filters.length; i++) {
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
                    $('#' + textareaId).trigger('filter:switch:on', this._editors[textareaId]);
                }
                catch (e) {
                    console.log(e)
                }
            }
        },
        switchOff: function (textareaId) {
            var filter = this.get(textareaId);
            try {
                if (filter && typeof(filter[2]) == 'function') {
                    filter[2](this._editors[textareaId], textareaId);
                }
                this._switchedOn[textareaId] = null;
                $('#' + textareaId).trigger('filter:switch:off');
            }
            catch (e) {
            }
        },
        get: function (textareaId) {
            for (var key in this._switchedOn) {
                if (key == textareaId)
                    return this._switchedOn[key];
            }
            return null;
        },
        exec: function (textareaId, command, data) {
            var filter = this.get(textareaId);
            if (filter && typeof(filter[3]) == 'function')
                return filter[3](this._editors[textareaId], command, textareaId, data);
            return false;
        }
    },
    Popup: {
        _target: null,
        _defaults: {
            fixed: true,
            width: '95%',
            height: '93%',
            maxWidth: '95%',
            maxHeight: '93%',
            transition: 'fade',
            opacity: 0.4,
            speed: 100,
            close: '<i class="fa fa-times fa-fw" />',
            onLoad: function (a, b) {
                Popup._target = a;
            }
        },
        _resizeTimer: null,
        defaults: function () {
            return this._defaults;
        },
        openHTML: function (html, params, parent) {
            if (!params) var params = {};

            if (html instanceof jQuery)
                var options = {
                    inline: true,
                    href: html
                };
            else
                var options = {
                    html: html
                };

            return this.get($.extend(params, options), parent);
        },
        openIframe: function (href, params, parent) {
            if (!params) var params = {};

            return this.openUrl(href, $.extend(params, {
                iframe: true
            }), parent);
        },
        openUrl: function (href, params, parent) {
            if (!params) var params = {};

            return this.get($.extend(params, {
                href: href
            }), parent);
        },
        openWindow: function (href) {
            var newWindow = window.open(href, '', 'height=600,width=800');

            newWindow.onload = function (e, a) {
                var $document = newWindow.document;
                if (typeof newWindow.SITE_URL != 'undefined') {
                    $('#content', $document).prependTo($('body', $document));
                    $('#main-wrapper', $document).remove();
                }
            };
        },
        close: function () {
            window.top.$.colorbox.close();
        },
        get: function (options, parent) {
            $(window).resize(this.resize);

            var options = $.extend({}, this.defaults(), options);

            if (parent)
                return window.top.$.colorbox(options);

            return $.colorbox(options);
        },
        resize: function resizeColorBox() {
            if (this._resizeTimer) clearTimeout(this._resizeTimer);
            this._resizeTimer = setTimeout(function () {
                $.colorbox.resize({
                    width: '95%',
                    height: '93%',
                    speed: 100
                });
            }, 500);
        }
    }
};