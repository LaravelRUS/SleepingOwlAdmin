Admin.Modules.add('display.datatables', () => {
    $.fn.dataTable.ext.errMode = () => {
        Admin.Messages.error(
            i18next.t('lang.table.error')
        )
    };

    $.fn.dataTable.ext.order['DateTime'] = function (settings, col) {
        return this.api().column(col, {order: 'index'}).nodes().map((td, i) => {
            return $(td).data('value');
        });
    }

    $('.datatables').each((i, item) => {
        let $this = $(item),
            id = $this.data('id'),
            params = $this.data('attributes'),
            url = $this.data('url')

        if (url && url.length > 0) {
            params.serverSide = true
            params.processing = true
            params.ajax = {
                url: url,
                data (d) {
                    Admin.Events.fire('datatables::ajax::data', d)

                    $('[data-datatables-id="' + id + '"] .column-filter[data-type]').each((i, subitem) => {
                        let $this = $(subitem),
                            index = $this.closest('td').data('index')

                        if (name = $this.data('ajax-data-name')) {
                            d.columns[index]['search'][name] = $this.val()
                        }
                    });
                }
            };
        }

        params.fnDrawCallback = function (oSettings) {
            Admin.Events.fire('datatables::draw', this)
        }

        var table = $this.DataTable(params);

        $('[data-datatables-id="' + id + '"] .column-filter[data-type]').each((i, item) => {
            let $this = $(item),
                type = $this.data('type'),
                index = $this.closest('td').data('index');

            if (_.isFunction(window.columnFilters[type])) {
                window.columnFilters[type](item, table.api(), table.api().column(index), index, params.serverSide);
            }
        })
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
            column.search($dateField.val()).draw();
        })
    },
    range (container, table, column, index, serverSide) {
        let $container = $(container),
            from = $('input:first', $container),
            to = $('input:last', $container);

        var isDateRange = false;

        from.data('ajax-data-name', 'from');
        to.data('ajax-data-name', 'to');

        from
            .add(to)
            .on('keyup change', function () {
                if (serverSide) {
                    column.search(from.val() + '::' + to.val()).draw()
                } else {
                    table.draw();
                }
            });

        if (from.closest('.input-date').length > 0 && to.closest('.input-date').length > 0) {
            from.closest('.input-date')
                .add(to.closest('.input-date'))
                .on('dp.change', function () {
                    if (serverSide) {
                        column.search(from.val() + '::' + to.val()).draw()
                    } else {
                        table.draw();
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
        var $input = $(input);

        $input.on('change', () => {
            let val = $input.val() ? $input.find(':selected').text() : '';
            column.search(val).draw()
        });
    },
    text (input, table, column, index, serverSide) {
        var $input = $(input)

        $input.on('keyup change', () => {
            column.search($input.val()).draw();
        })
    }
}