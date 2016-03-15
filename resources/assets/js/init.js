$(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });


    $('.inline-editable').editable();

    Admin.Components.init();
    Admin.Controllers.call();
});