$(function ()
{
	$('.multiselect').each(function ()
	{
		var $this = $(this);
		var nullable = $this.data('nullable');
		$this.chosen({
			allow_single_deselect: nullable,
			no_results_text: window.admin.lang.select.nothing,
			placeholder_text_single: window.admin.lang.select.placeholder,
			placeholder_text_multiple: window.admin.lang.select.placeholder,
		});
	});
});