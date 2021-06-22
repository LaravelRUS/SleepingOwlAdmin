Admin.Modules.register('display.tree', () => {
    let $elem = $('.nestable'), maxDepth = $elem.data('max-depth');

    $elem.nestable({
        maxDepth: maxDepth
    }).on('change', (e) => {
        let $object = $(e.target);

        $.post(
            $object.data('url'),
            {
                data: $object.nestable('serialize'),
                parameters: $elem.data('parameters')
            }
        ).done( function() {

            Admin.Events.fire('display.tree::changed');

            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'success',
              title: trans('lang.tree.reorderCompleted')
            })

            // new Noty({
            //     type: 'success',
            //     timeout:3000,
            //     text: trans('lang.tree.reorderCompleted')
            // }).show();
        });
    });

    $('#nestable-menu').on('click', function(e) {
        var target = $(e.target),
            action = target.data('action');

        if (action === 'expand-all') {
            $('.nestable').nestable('expandAll')
        }

        if (action === 'collapse-all') {
            $('.nestable').nestable('collapseAll')
        }
    })
});
