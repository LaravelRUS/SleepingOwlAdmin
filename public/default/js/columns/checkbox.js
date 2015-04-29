$(function ()
{
	$('.adminCheckboxAll').change(function ()
	{
		var checked = $(this).is(':checked');
		$('.adminCheckboxRow').prop('checked', checked).filter(':first').change();
	});
	$(document).delegate('.adminCheckboxRow', 'change', function ()
	{
		var selected = [];
		$('.adminCheckboxRow:checked').each(function ()
		{
			selected.push($(this).val());
		});
		$('.tableActions .btnAction').each(function ()
		{
			var $this = $(this);
			var url = $this.data('href') + selected.join(',');
			$this.attr('href', url);
		});
	});
});