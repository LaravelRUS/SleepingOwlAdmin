$(function () {
    $.fn.dataTable.ext.errMode = function () {
        window.Admin.Messages.error(window.Admin.Settings.lang.table.error);
    };

    $.fn.dataTable.ext.order['DateTime'] = function (settings, col) {
        return this.api().column(col, {order: 'index'}).nodes().map(function (td, i) {
            return $(td).data('value');
        });
    }

    $('.datatables').each(function () {
        var $this = $(this),
            id = $this.data('id'),
            params = {
                language: window.Admin.Settings.lang.table,
                stateSave: true,
                lengthMenu: [
                    [10, 25, 50, -1],
                    [10, 25, 50, window.Admin.Settings.lang.table.all]
                ]
            };

        params = $.extend(params, $this.data('attributes'));

        var url;
        if (url = $this.data('url')) {
            params.serverSide = true;
            params.processing = true;
            params.ajax = {
                url: url,
                data: function (d) {
                    $('[data-datatables-id="' + id + '"] .column-filter').each(function () {
                        var $this = $(this);
                        var index = $this.closest('td').data('index');
                        if (name = $this.data('ajax-data-name')) {
                            d.columns[index]['search'][name] = $this.val();
                        }
                    });
                }
            };
        }
        var table = $this.DataTable(params);

        $('[data-datatables-id="' + id + '"] .column-filter').each(function () {
            var $this = $(this),
                type = $this.data('type'),
                index = $this.closest('td').data('index');

            if (typeof window.columnFilters[type] == 'function') {
                window.columnFilters[type](this, table, table.column(index), index);
            }
        });
    });
});

window.columnFilters = {
    range: function (container, table, column, index) {
        var $container = $(container);

        var $input = $container.find('input');

        var from = $input.filter(':first');
        var to = $input.filter(':last');

        from.data('ajax-data-name', 'from');
        to.data('ajax-data-name', 'to');

        $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
            if (table.settings()[0].sTableId != settings.sTableId) {
                return true;
            }

            var value = table.data()[dataIndex][index];
            if (value && value['@data-order'] !== undefined) {
                value = value['@data-order'];
            }

            var fromValue = from.val();
            var toValue = to.val();

            if ((from.closest('.input-date').length > 0) && (to.closest('.input-date').length > 0)) {
                if (fromValue != '') {
                    fromValue = from.closest('.input-date').data('DateTimePicker').date();
                } else {
                    fromValue = Number.NEGATIVE_INFINITY;
                }

                if (toValue != '') {
                    toValue = to.closest('.input-date').data('DateTimePicker').date();
                } else {
                    toValue = Number.POSITIVE_INFINITY;
                }

                value = moment(value);
            } else {
                value = parseInt(value);
                fromValue = parseInt(fromValue);
                toValue = parseInt(toValue);
            }

            if (( isNaN(fromValue) && isNaN(toValue) ) ||
                ( isNaN(fromValue) && value <= toValue ) ||
                ( fromValue <= value && isNaN(toValue) ) ||
                ( fromValue <= value && value <= toValue )) {
                return true;
            }

            return false;
        });

        $input.on('keyup change dp.change', function () {
            table.draw();
        });
    },
    select: function (input, table, column, index) {
        var $input = $(input);

        $input.on('change', function () {
            var val = $input.val() ? $input.find(':selected').text() : '';
            column.search(val).draw();
        });
    },
    text: function (input, table, column, index) {
        var $input = $(input);

        $input.on('keyup change', function () {
            column.search($input.val()).draw();
        });
    }
}