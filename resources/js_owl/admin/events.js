$('a[data-toggle="tab"]')
    .on('shown.bs.tab', function (e) {
        let tab = $(e.target).attr('aria-controls');
        Admin.Events.fire('bootstrap::tab::shown', tab);
    })
    .on('hidden.bs.tab', function (e) {
        let tab = $(e.target).attr('aria-controls');
        Admin.Events.fire('bootstrap::tab::hidden', tab);
    });
