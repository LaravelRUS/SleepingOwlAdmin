Admin.Modules.add('display.tree', () => {
    $('.nestable').nestable({
        maxDepth: 20
    }).on('change', (e) => {
        let $object = $(e.target)

        $.post(
            $object.data('url'), {
                data: $object.nestable('serialize')
            }
        );
    });
})