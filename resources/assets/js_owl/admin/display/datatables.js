Admin.Modules.register('display.datatables', () => {
    const stateFilters = Admin.Config.get('state_filters')

    if (stateFilters) {
        var filters = $('.display-filters[data-display="DisplayDatatablesAsync"]')

        if (filters.length > 0) {
            urlName = getName()
            //Check in localStorage
            if (localStorage.getItem(urlName)) {
                activeFilters = localStorage.getItem(urlName)
                setActiveFilters(filters, activeFilters)
            }
        }
    }


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

            if (Admin.Config.get('state_datatables')) {
                params.bStateSave = true;
            }

            if (!Admin.Config.get('state_filters')) {
                params.stateSaveParams = function (settings, item) {
                    item.search.search = ''
                    var columns = item.columns
                    $.each(columns, function(index, value){
                        value.search.search = ''
                    })
                }
            }

            params.ajax = {
                url: url,
                data (d) {
                    Admin.Events.fire('datatables::ajax::data', d)

                    // nit:Daan
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
            jQuery('[data-toggle="tooltip"]').tooltip()
            //use LazyLoad
            lazyload()

            //add td highlight in config
            if (Admin.Config.get('datatables_highlight')) {
              jQuery("[data-id="+this.data("id")+"].lightcolumn tbody").on('mouseenter', 'td', function() {
                  if (table.data().any()) {
                      var colIdx = table.cell(this).index().column;

                      jQuery(table.cells().nodes()).removeClass('highlight');
                      jQuery(table.column(colIdx).nodes()).addClass('highlight');
                  }
              })
            }
        }

        params.createdRow = function (row, data, dataIndex) {
            let row_class = data[data.length - 1];
            if (row_class && row_class.add_class) {
                $(row).addClass(row_class.add_class);
            }
        }

        let table = $this.DataTable(params);


        iterateColumnFilters(id, function ($element, index, type) {
            if (_.isFunction(window.columnFilters[type])) {
                window.columnFilters[type]($element, table, table.column(index), index, params.serverSide);
            }
        });



        $("[data-datatables-id="+$this.data("id")+"] #filters-exec").on('click', function () {
            if (stateFilters) {
                fillFilters(filters)
            }
            table.draw()
        });

        //clear filter
        $("[data-datatables-id="+$this.data("id")+"] #filters-cancel").on('click', function () {
            let input = $(".display-filters [data-index] input")
            input.val(null)
            input.trigger('change')

            let selector = $(".display-filters [data-index] select")
            selector.val(null)
            selector.trigger('change')

            table.state.clear();
            var urlName = 'Filters_/' + Admin.Url.url_path
            localStorage.removeItem(urlName)
            table.draw()
        });

        $("[data-datatables-id="+$this.data("id")+"].display-filters [data-index] input").on('keyup', function(e) {
            if(e.keyCode === 13) {
                table.draw()
            }
        })

    })


    // ==========================
    //Get localStorage name
    function getName() {
        var path = Admin.Url.url_path

        //Simplify name for edit
        var isEdit = path.search('edit') > 0;
        if (isEdit) {
            path = path.replace(/\d+\/edit$/, '') + 'edit'
        }

        var urlName = 'Filters_/' + path
        return urlName
    }

    //Fill Filters array
    function fillFilters(filters) {

        var arr = {}
        //each datatables
        filters.each((index, item) => {
            var f = {}
            var columns = jQuery(item).find('[data-index]')

            //each datatables.columns
            columns.each((i, column) => {
                var col = jQuery(column).find('.column-filter')

                if (col.length > 0) {
                    var type = col.data('type')

                    if (type == "range") {
                        var r = {}
                        var range = jQuery(col).find('.form-control.column-filter')
                        if (range.length > 0) {
                            //each datatables.columns.range
                            range.each((index, item) => {
                                if (item.value) {
                                    r[index] = item.value
                                }
                            })
                        }
                        if (!jQuery.isEmptyObject(r)) {
                            var inner = {}
                            inner['type'] = type
                            inner['val'] = r
                        }
                    } else if (type == "control") {
                        // no save
                    } else {
                        if (col.val()) {
                            var inner = {}
                            inner['type'] = type
                            inner['val'] = col.val()
                        }
                    }
                    if (!jQuery.isEmptyObject(inner)) {
                        f[i] = inner
                    }
                }
            })
            if (!jQuery.isEmptyObject(f)) {
                arr[index] = f
            }
        })

        if (!jQuery.isEmptyObject(arr)) {
            try {
                localStorage.setItem(urlName, JSON.stringify(arr))
            } catch (e) {
                localStorage.clear()
                localStorage.setItem(urlName, JSON.stringify(arr))
            }
        } else {
          localStorage.removeItem(urlName)
        }
    }

    //Set all filters
    function setActiveFilters(filters, activeFilters) {
        array = JSON.parse(activeFilters);

        //Iterate array filter
        jQuery.each(array, function(index, datatable) {
            var datatables_id = jQuery(filters[index]).data('datatablesId')
            jQuery.each(datatable, function(index, column) {
                if (column.type == 'range') {
                    jQuery.each(column.val, function(i, item) {
                        var rangeFilter = jQuery('[data-datatables-id="'+ datatables_id +'"] [data-index="'+ index +'"] [data-type="range"] .column-filter')
                        $(rangeFilter[i]).val(item).trigger('change')
                    })
                } else {
                    var cfilter = jQuery('[data-datatables-id="'+ datatables_id +'"] [data-index="'+ index +'"] .column-filter')
                    if (cfilter.length) {
                        jQuery(cfilter).val(column.val).trigger('change')
                    }
                }
            })
        })
    }
    // ==========================

})
// ============= end module

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
    date (dateField, table, column, index, serverSide) {
        let $dateField = $(dateField)
        $dateField.closest('.input-date')
        .on('dp.change', function () {
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
    },

    //text ========================================
    daterange (input, table, column, index, serverSide) {
        let $input = $(input)

        $input.on('keyup change', () => {
            column.search($input.val());
        })
    }
}
