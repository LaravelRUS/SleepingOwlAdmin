$(function ()
{
	$('.datepicker').each(function ()
	{
		var $this = $(this);
		$this.datetimepicker({
			language: window.admin.locale,
			icons: {
				time: "fa fa-clock-o",
				date: "fa fa-calendar",
				up: "fa fa-arrow-up",
				down: "fa fa-arrow-down"
			}
		}).trigger('dp.change').on('dp.change', function ()
		{
			$this.find('input').change();
		});
	});
});