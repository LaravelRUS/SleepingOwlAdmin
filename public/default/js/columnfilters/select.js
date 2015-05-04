window.columnFilters.select = function (input, table)
{
	var $input = $(input);
	var index = $input.closest('td').data('index');
	$input.on('change', function ()
	{
		table.column(index).search($input.val()).draw();
	});
};