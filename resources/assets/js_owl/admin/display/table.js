Admin.Modules.register('display.table', () => {

    //use LazyLoad
    lazyload()

    //nit: Daan
    // Все что ниже было отключено, но для работы ленивой загрузке нужно вызвать этот модуль

    // $('.display-filters[data-display="DisplayTable"]').each((i, el) => {
    //     let $self = $(el),
    //         $filtersRow = $self.find('tr').first(),
    //         tag = $self[0].tagName,
    //         $filters = $filtersRow.find('td'),
    //         $button = $('<button class="btn btn-default">' + trans('lang.table.filters.control') + '</button>')
    //
    //     $filtersRow.after(
    //         $(`<tr><td colspan="${$filters.length}" class="text-right"></td></tr>`).append($button)
    //     )
    //
    //     $button.on('click', () => {
    //         let query = {columns: []}
    //
    //         $filters.each((i, td) => {
    //             let $filter = $(td).find('.column-filter'),
    //                 val = null
    //
    //             switch ($filter.data('type')) {
    //                 case 'range':
    //
    //                     break
    //
    //                 case 'text':
    //                 case 'select':
    //                     val = $filter.val()
    //
    //                     break
    //             }
    //
    //             if (!_.isNull(val) && val.length > 0) {
    //                 query['columns'][i] = {
    //                     search: {
    //                         value: val
    //                     }
    //                 }
    //             }
    //         })
    //
    //         Admin.Url.query(query)
    //     })
    // })
})
