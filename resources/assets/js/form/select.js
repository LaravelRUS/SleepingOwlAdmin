$(function () {
    $('.input-select').each(function () {
        var $self = $(this);
        
        if ($self.data('select2')) {
            return;
        }

        var options = $.extend({}, $self.data('widgetOptions') || {}),
            customize = $self.data('widgetCustomizeOptions'),
            isDynamic = $self.data('dynamic'),
            dynOptions = $self.data('dynamicOptions'),
            customizeDynOptions = $self.data('customizeDynamicOptions');

        if ($self.hasClass('input-taggable')) {
            options['tags'] = true;
        }

        // if data sources is dynamic
        if (isDynamic) {
            dynOptions = (function () {
                var r = $.extend({}, {
                    static: null,
                    cache: true,
                    perPage: 10,
                    minInputLength: 2,
                    itemsProperty: 'items',
                    totalCountProperty: 'total_count',
                    dependency: {},
                    delay: 500,
                    termParam: 'q',
                    pageParam: 'page',
                    params: null,
                    value: null,
                    findByIdUrl: null,
                    idParam: 'id',
                    idParamSep: ','
                }, dynOptions), dep, k;

                if (r.static && !$.isArray(r.static)) {
                    r.static = eval(r.static);
                }

                if (r.dependency) {
                    for (k in r.dependency) {
                        if (/^\d+$/.test(k)) {
                            r.dependency[r.dependency[k]] = r.dependency[k];
                            delete r.dependency[k];
                        }
                    }

                    var d = {
                        // query string map
                        qs: {},
                        // fields
                        fields: {},
                        // utils
                        prepare: function (data) {
                            var k, dep;

                            for (k in this.qs) {
                                data[k] = this.getQSValue(k);
                            }

                            for (k in this.fields) {
                                data[k] = this.getFieldValue(k);
                            }
                        },
                        getField: function (name) {
                            return this.getFieldEl(this.fields[name])
                        },
                        getFieldEl: function (selector) {
                            return $self.closest('form').find(selector)
                        },
                        getFieldValue: function (name) {
                            return this.getField(name).val()
                        },
                        getFields: function () {
                            var k, args, r = [];

                            for (k in this.fields) {
                                r[r.length] = this.getField(k)
                            }

                            return r;
                        },
                        getQSValue: function (name) {
                            return $.url.param(name)
                        },
                        forEachFields: function (callback) {
                            var fields = this.getFields(), i;
                            for (i = 0; i < fields.length; i++) {
                                callback(fields[i]);
                            }
                        }
                    };

                    for (k in r.dependency) {
                        dep = r.dependency[k];

                        if (dep[0] == ':') {
                            // QUERY STRING
                            d.qs[k] = dep.substr(1);
                        }
                        else if (dep[0] == '@') {
                            // custom SELECTOR
                            d.fields[k] = dep.substr(1)
                        }
                        else {
                            // by ID
                            d.fields[k] = '#' + dep
                        }
                    }

                    r.dependencies = d;
                }

                return r;
            })();

            // if has customize default dynamic options function
            if (customizeDynOptions) {
                customizeDynOptions = eval(customizeDynOptions);
                // call it and set new dynamic options
                dynOptions = customizeDynOptions(dynOptions);
            }

            $self.data('dynOptionsObj', dynOptions);

            // bind changes on dependencies
            dynOptions.dependencies.forEachFields(function ($dep) {
                $dep.change(function () {
                    // set the default value
                    // if is a Array object, set it,
                    // else set as empty
                    $self.val($self.data('default') || null).trigger("change");
                });
            });

            if (dynOptions.static) {
                // if is a static data sources array
                // see https://select2.github.io/examples.html#data-array
                options.data = eval(dynOptions.static);
            } else {
                // remote data source
                // see https://select2.github.io/examples.html#data-ajax
                options.ajax = {
                    url: function (params) {
                        if (params.hasOwnProperty(dynOptions.idParam)) {
                            return dynOptions.findByIdUrl || dynOptions.url;
                        }
                        return dynOptions.url;
                    },
                    dataType: 'json',
                    delay: dynOptions.delay,
                    data: function (params) {
                        var r = $.extend({}, params, dynOptions.params || {});

                        if (params.hasOwnProperty('term')) {
                            delete r.term;
                            r[dynOptions.termParam] = params.term;
                        }

                        if (params.hasOwnProperty('page')) {
                            delete r.term;
                            r[dynOptions.pageParam] = params.page;
                        }

                        try {
                            delete r._query;
                        } catch (err) {}

                        dynOptions.dependencies.prepare(r);

                        return r;
                    },
                    processResults: function (data, params) {
                        // parse the results into the format expected by Select2
                        // since we are using custom formatting functions we do not need to
                        // alter the remote JSON data, except to indicate that infinite
                        // scrolling can be used
                        params.page = params.page || 1;

                        var itemsProperty = dynOptions.itemsProperty.split('.');
                        var items = data;

                        for (var i = 0; i < itemsProperty.length; i++) {
                            items = items[itemsProperty[i]];
                        }

                        var total = eval('data.' + dynOptions.totalCountProperty);

                        if (items.length > 0) {
                            if ($.isArray(items[0])) {
                                for (i = 0; i < items.length; i++) {
                                    items[i] = {
                                        id: items[i][0],
                                        text: items[i][1]
                                    }
                                }
                            }
                        }

                        return {
                            results: items,
                            params: params,
                            pagination: {
                                more: (params.page * dynOptions.perPage) < total
                            }
                        };
                    },
                    cache: dynOptions.cache
                };

                options.minimumInputLength = dynOptions.minInputLength;
            }

            if (options.escapeMarkup && $.type(options.escapeMarkup) == 'string') {
                options.escapeMarkup = eval(options.escapeMarkup);
            }

            if (options.templateResult && $.type(options.templateResult) == 'string') {
                options.templateResult = eval(options.templateResult);
            }

            if (options.templateSelection && $.type(options.templateSelection) == 'string') {
                options.templateSelection = eval(options.templateSelection);
            }
        }

        // if has customize default options function
        if (customize) {
            customize = eval(customize);
            // call it and set new options
            options = customize(options);
        }

        $self.select2(options);

        if (isDynamic && dynOptions.value) {
            var s = $self.data('select2');
            var params = {};
            params[dynOptions.idParam] = ($.isArray(dynOptions.value) ?
                dynOptions.value.join(dynOptions.idParamSep) :
                dynOptions.value.toString());

            s.dataAdapter.query(params, function (results) {
                var r;

                if ($.isArray(dynOptions.value)) {
                    var map = {};

                    $.each(dynOptions.value, function (i, value) {
                        map[value.id] = true;
                    });

                    r = results.results.filter(function (item) {
                        return map.hasOwnProperty(item.id);
                    });
                } else {
                    r = results.results.filter(function (item) {
                        return dynOptions.value == item.id;
                    });
                }

                if (r.length == 1) {
                    r = r[0];
                }

                if (r) {
                    s.selection.container.trigger('select', {data: r});
                }
            });
        }
    });
});