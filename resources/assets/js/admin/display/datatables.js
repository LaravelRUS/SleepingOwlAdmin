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
        var $this = $(item),
            id = $this.data('id');

        var params = $this.data('attributes');

        var url;
        if (url = $this.data('url')) {
            params.serverSide = true;
            params.processing = true;
            params.ajax = {
                url: url,
                data (d) {
                    Admin.Events.fire('datatables::ajax::data', d)

                    $('[data-datatables-id="' + id + '"] .column-filter[data-type]').each((i, subitem) => {
                        var $this = $(subitem);
                        var index = $this.closest('td').data('index');
                        if (name = $this.data('ajax-data-name')) {
                            d.columns[index]['search'][name] = $this.val();
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
            var $this = $(item),
                type = $this.data('type'),
                index = $this.closest('td').data('index');

            if (_.isFunction(window.columnFilters[type])) {
                window.columnFilters[type](item, table.api(), table.api().column(index), index);
            }
        });
    });
});

window.columnFilters = {
    range (container, table, column, index) {
        let $container = $(container),
            from = $('input:first', $container),
            to = $('input:last', $container);

        var isDateRange = false;

        from.data('ajax-data-name', 'from');
        to.data('ajax-data-name', 'to');

        from
            .add(to)
            .on('keyup change', function () {
                table.draw();
            });

        if (from.closest('.input-date').length > 0 && to.closest('.input-date').length > 0) {
            from.closest('.input-date')
                .add(to.closest('.input-date'))
                .on('dp.change', function () {
                    table.draw();
                });

            isDateRange = true;
        }

        let checkDateRange = (from, to, value) => {
            let fromValue = from.val(),
                toValue = to.val();

            if (fromValue != '') {
                fromValue = from.closest('.input-date').data('DateTimePicker').date();
            } else {
                fromValue = undefined;
            }

            if (toValue != '') {
                toValue = to.closest('.input-date').data('DateTimePicker').date();
            } else {
                toValue = undefined;
            }

            value = moment(value, from.data('date-format'));

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

        let checkNumberRange = (from, to, value) => {
            let fromValue = parseInt(from.val()),
                toValue = parseInt(to.val());

            value = parseInt(value);

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

        $.fn.dataTable.ext.search.push((settings, data, dataIndex) => {
            if (table.settings()[0].sTableId != settings.sTableId) {
                return true;
            }

            let value = data[index];

            if (value && !_.isUndefined(value['@data-order'])) {
                value = value['@data-order'];
            }

            if (isDateRange) {
                return checkDateRange(from, to, value)
            }

            return checkNumberRange(from, to, value)
        });
    },
    select (input, table, column, index) {
        var $input = $(input);

        $input.on('change', () => {
            let val = $input.val() ? $input.find(':selected').text() : '';
            column.search(val).draw()
        });
    },
    text (input, table, column, index) {
        var $input = $(input)

        $input.on('keyup change', () => {
            column.search($input.val()).draw();
        })
    }
}