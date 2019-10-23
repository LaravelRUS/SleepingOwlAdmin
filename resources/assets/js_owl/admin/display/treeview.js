Admin.Modules.register('display.tree', () => {
    let $elem = $('.nestable'), maxDepth = $elem.data('max-depth');
    let $collapsed = $elem.data('collapsed');

    $elem.nestable({
        maxDepth: maxDepth
    }).on('change', (e) => {
        let $object = $(e.target)

        $.post(
            $object.data('url'),
            {
                data: $object.nestable('serialize')
            },
            function() {
                Admin.Events.fire('display.tree::changed')
            }
        );
    })

    if ($collapsed) {
      $elem.nestable('collapseAll');
    }

    $('#nestable-menu').on('click', function(e) {
        var target = $(e.target),
            action = target.data('action')

        if (action === 'expand-all') {
            $('.nestable').nestable('expandAll')
        }

        if (action === 'collapse-all') {
            $('.nestable').nestable('collapseAll')
        }
    })
})
