$(function ()
{
	$('.datepicker').datetimepicker({
		language: window.admin.locale,
		icons: {
			time: "fa fa-clock-o",
			date: "fa fa-calendar",
			up: "fa fa-arrow-up",
			down: "fa fa-arrow-down"
		}
	}).trigger('dp.change');
});