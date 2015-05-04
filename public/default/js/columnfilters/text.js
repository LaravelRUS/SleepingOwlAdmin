window.columnFilters.text = function (input, table)
{
	var $input = $(input);
	var index = $input.closest('td').data('index');
	$input.on('keyup change', function ()
	{
		table.column(index).search($input.val()).draw();
	});
};