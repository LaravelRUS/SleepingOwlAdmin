Admin.Modules.register('display.datatables', () => {
   localStorage.clear();

    $.fn.dataTable.ext.errMode = (dt) => {
        Admin.Messages.error(
            dt.jqXHR.responseJSON.message || trans('lang.table.error')
        )
    };

    $.fn.dataTable.ext.order['DateTime'] = function (settings, col) {
        return this.api().column(col, {order: 'index'}).nodes().map((td, i) => {
            return $(td).data('value');
        });
    }

    function iterateColumnFilters(datatableId, callback) {
        $(`[data-datatables-id="${datatableId}"] .column-filter[data-type]`).each((i, subitem) => {
            let $element = $(subitem)

            callback(
                $element,
                $element.closest('[data-index]').data('index'),
                $element.data('type')
            )
        });
    }

    $('.datatables').each((i, item) => {
        let $this = $(item),
            id = $this.data('id'),
            params = $this.data('attributes') || {},
            url = $this.data('url'),
            payload = $this.data('payload'),
            search = $this.data('display-search') || false,
            dtlength = $this.data('display-dtlength') || false;

        if (url && url.length > 0) {
            params.serverSide = true;
            params.processing = true;

            //<"H"lfr>t<"F"ip>
            params.sDom = '<"H"';

            if(dtlength){
                params.sDom += 'l';
            }

            if(search){
                params.sDom += 'f';
            }

            params.sDom += 'r>t<"F"ip>';

            params.bStateSave = true;

            params.ajax = {
                url: url,
                data (d) {
                    Admin.Events.fire('datatables::ajax::data', d)

                    iterateColumnFilters(id, function ($element, index, type) {
                        if (name = $element.data('ajax-data-name')) {
                            d.columns[index]['search'][name] = $element.val()
                        }
                    });
                    d.payload = payload;
                }
            };
        }

        params.fnDrawCallback = function (oSettings) {
            Admin.Events.fire('datatables::draw', this)
        }

        let table = $this.DataTable(params);

        iterateColumnFilters(id, function ($element, index, type) {
            if (_.isFunction(window.columnFilters[type])) {
                window.columnFilters[type]($element, table, table.column(index), index, params.serverSide);
            }
        });

        $("[data-datatables-id="+$this.data("id")+"] #filters-exec").on('click', function () {
            table.draw();
        });

        $("[data-datatables-id="+$this.data("id")+"] #filters-cancel").on('click', function () {
            let input = $(".display-filters td[data-index] input").val(null);
            input.trigger('change');

            let selector = $(".display-filters td[data-index] select");
            selector.val(null);
            selector.trigger('change');

            table.draw();
        });

        $("[data-datatables-id="+$this.data("id")+"].display-filters td[data-index] input").on('keyup', function(e){
            if(e.keyCode === 13){
                table.draw();
            }
        });
    })
})

window.checkNumberRange = (fromValue, toValue, value) => {
    if(_.isNaN(fromValue) && _.isNaN(toValue)) {
        return true;
    }

    if(_.isNaN(value)) {
        return false;
    }

    if(_.isNaN(fromValue) && value <= toValue) {
        return true;
    }

    if( _.isNaN(toValue) && value >= fromValue) {
        return true;
    }

    return value >= fromValue && value <= toValue;
}

window.checkDateRange = (fromValue, toValue, value) => {
    if(!_.isObject(fromValue) && !_.isObject(toValue)) {
        return true;
    }

    if (!value.isValid()) {
        return false;
    }

    if (!_.isObject(fromValue) && value.isSameOrBefore(toValue)) {
        return true;
    }

    if(!_.isObject(toValue) && value.isSameOrAfter(fromValue)) {
        return true;
    }

    return value.isBetween(fromValue, toValue)
}

window.columnFilters = {
    daterange (dateField, table, column, index, serverSide) {
        let $dateField = $(dateField);

        $dateField.on('apply.daterangepicker', function(e, date) {
            column.search($dateField.val());
        })
    },
    range (container, table, column, index, serverSide) {
        let $container = $(container),
            from = $('input:first', $container),
            to = $('input:last', $container),
            isDateRange = false;

        from.data('ajax-data-name', 'from');
        to.data('ajax-data-name', 'to');

        from
            .add(to)
            .on('keyup change', function () {
                if (serverSide) {
                    column.search(from.val() + '::' + to.val())
                } else {
                    table.draw();
                }
            });

        if (from.closest('.input-date').length > 0 && to.closest('.input-date').length > 0) {
            from.closest('.input-date')
                .add(to.closest('.input-date'))
                .on('dp.change', function () {
                    if (serverSide) {
                        column.search(from.val() + '::' + to.val())
                    }
                });

            isDateRange = true;
        }

        if (serverSide) {
            return;
        }

        $.fn.dataTable.ext.search.push((settings, data, dataIndex) => {
            if (table.settings()[0].sTableId != settings.sTableId) {
                return true;
            }

            let value = data[index];

            if (value && !_.isUndefined(value['@data-order'])) {
                value = value['@data-order'];
            }

            if (isDateRange) {
                return checkDateRange(
                    from.val().length > 0 && from.closest('.input-date').data('DateTimePicker').date(),
                    to.val().length > 0 && to.closest('.input-date').data('DateTimePicker').date(),
                    moment(value, from.data('date-format'))
                )
            }

            return checkNumberRange(
                parseInt(from.val()),
                parseInt(to.val()),
                parseInt(value)
            )
        });
    },
    select (input, table, column, index, serverSide) {
        let $input = $(input);

        $input.on('change', () => {
            let selected = [];
            $input.find(':selected').each((i, e) => {
                let $option = $(e);

                if ($option.val().length) {
                    selected.push($option.val());
                }
            })

            if (serverSide) {
                column.search(selected.join(':::'))
            } else {
                column.search(selected.join('|'), true, false, true)
            }
        });
    },
    text (input, table, column, index, serverSide) {
        let $input = $(input)

        $input.on('keyup change', () => {
            column.search($input.val());
        })
    }
}