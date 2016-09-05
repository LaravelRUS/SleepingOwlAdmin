$('a[data-toggle="tab"]')
    .on('shown.bs.tab', function (e) {
        Admin.Events.fire('bootstrap::tab::shown')
    })
    .on('hidden.bs.tab', function (e) {
        Admin.Events.fire('bootstrap::tab::hidden')
    })