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

        params.dom = search || dtlength ? "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" : "" +
                         "<'row'<'col-sm-12'tr>>" +
                         "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>";

        params.renderer = 'bootstrap';

        params.oClasses = {
            sWrapper:      "dataTables_wrapper dt-bootstrap4",
            sFilterInput:  "form-control form-control-sm",
            sLengthSelect: "custom-select custom-select-sm form-control form-control-sm",
            sProcessing:   "dataTables_processing",
            sPageButton:   "paginate_button page-item"
        };

        window.DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
            var api     = new window.DataTable.Api( settings );
            var classes = settings.oClasses;
            var lang    = settings.oLanguage.oPaginate;
            var aria = settings.oLanguage.oAria.paginate || {};
            var btnDisplay, btnClass, counter=0;

            var attach = function( container, buttons ) {
                var i, ien, node, button;
                var clickHandler = function ( e ) {
                    e.preventDefault();
                    if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
                        api.page( e.data.action ).draw( 'page' );
                    }
                };

                for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
                    button = buttons[i];

                    if ( $.isArray( button ) ) {
                        attach( container, button );
                    }
                    else {
                        btnDisplay = '';
                        btnClass = '';

                        switch ( button ) {
                            case 'ellipsis':
                                btnDisplay = '&#x2026;';
                                btnClass = 'disabled';
                                break;

                            case 'first':
                                btnDisplay = lang.sFirst;
                                btnClass = button + (page > 0 ?
                                    '' : ' disabled');
                                break;

                            case 'previous':
                                btnDisplay = lang.sPrevious;
                                btnClass = button + (page > 0 ?
                                    '' : ' disabled');
                                break;

                            case 'next':
                                btnDisplay = lang.sNext;
                                btnClass = button + (page < pages-1 ?
                                    '' : ' disabled');
                                break;

                            case 'last':
                                btnDisplay = lang.sLast;
                                btnClass = button + (page < pages-1 ?
                                    '' : ' disabled');
                                break;

                            default:
                                btnDisplay = button + 1;
                                btnClass = page === button ?
                                    'active' : '';
                                break;
                        }

                        if ( btnDisplay ) {
                            node = $('<li>', {
                                'class': classes.sPageButton+' '+btnClass,
                                'id': idx === 0 && typeof button === 'string' ?
                                    settings.sTableId +'_'+ button :
                                    null
                            } )
                                .append( $('<a>', {
                                        'href': '#',
                                        'aria-controls': settings.sTableId,
                                        'aria-label': aria[ button ],
                                        'data-dt-idx': counter,
                                        'tabindex': settings.iTabIndex,
                                        'class': 'page-link'
                                    } )
                                        .html( btnDisplay )
                                )
                                .appendTo( container );

                            settings.oApi._fnBindAction(
                                node, {action: button}, clickHandler
                            );

                            counter++;
                        }
                    }
                }
            };

            // IE9 throws an 'unknown error' if document.activeElement is used
            // inside an iframe or frame.
            var activeEl;

            try {
                // Because this approach is destroying and recreating the paging
                // elements, focus is lost on the select button which is bad for
                // accessibility. So we want to restore focus once the draw has
                // completed
                activeEl = $(host).find(document.activeElement).data('dt-idx');
            }
            catch (e) {}

            attach(
                $(host).empty().html('<ul class="pagination"/>').children('ul'),
                buttons
            );

            if ( activeEl !== undefined ) {
                $(host).find( '[data-dt-idx='+activeEl+']' ).focus();
            }
        };

        let table = $this.DataTable(params);

        iterateColumnFilters(id, function ($element, index, type) {
            if (_.isFunction(window.columnFilters[type])) {
                window.columnFilters[type]($element, table, table.column(index), index, params.serverSide);
            }
        });

        $("[data-datatables-id="+$this.data("id")+"] #filters-exec").on('click', function () {
            table.draw();
        });

        //clear filter
        $("[data-datatables-id="+$this.data("id")+"] #filters-cancel").on('click', function () {
            let input = $(".display-filters td[data-index] input").val(null);
            input.trigger('change');

            let selector = $(".display-filters td[data-index] select");
            selector.val(null);
            selector.trigger('change');
            table.draw();
        });

        $("[data-datatables-id="+$this.data("id")+"].display-filters td[data-index] input").on('keyup', function(e) {
            if(e.keyCode === 13) {
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
    //date ========================================
    daterange (dateField, table, column, index, serverSide) {
        let $dateField = $(dateField)
        $dateField.on('apply.daterangepicker', function(e, date) {
            column.search($dateField.val());
        })
    },

    //range ========================================
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

    //select ========================================
    select (input, table, column, index, serverSide) {
        let $input = $(input)
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

    //text ========================================
    text (input, table, column, index, serverSide) {
        let $input = $(input)
        $input.on('keyup change', () => {
            column.search($input.val());
        })
    }
}
