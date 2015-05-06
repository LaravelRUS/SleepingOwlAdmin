window.columnFilters.range = function (container, table)
{
	var $container = $(container);
	var $input = $container.find('input');
	var from = $input.filter(':first');
	var to = $input.filter(':last');
	var index = $container.closest('td').data('index');

	from.data('ajax-data-name', 'from');
	to.data('ajax-data-name', 'to');

	$.fn.dataTable.ext.search.push(function (settings, data, dataIndex)
	{
		if (table.settings()[0].sTableId != settings.sTableId)
		{
			return true;
		}
		var value = table.data()[dataIndex][index];
		if (value['@data-order'] !== undefined)
		{
			value = value['@data-order'];
		}

		var fromValue = from.val();
		var toValue = to.val();
		if ((from.closest('.datepicker').length > 0) && (to.closest('.datepicker').length > 0))
		{
			if (fromValue != '')
			{
				fromValue = from.closest('.datepicker').data('DateTimePicker').getDate();
			} else
			{
				fromValue = Number.NEGATIVE_INFINITY;
			}
			if (toValue != '')
			{
				toValue = to.closest('.datepicker').data('DateTimePicker').getDate();
			} else
			{
				toValue = Number.POSITIVE_INFINITY;
			}

			value = moment(value);
		} else
		{
			value = parseInt(value);
			if (fromValue != '')
			{
				fromValue = parseInt(fromValue);
			} else
			{
				fromValue = Number.NEGATIVE_INFINITY;
			}
			if (toValue != '')
			{
				toValue = parseInt(toValue);
			} else
			{
				toValue = Number.POSITIVE_INFINITY;
			}
		}

		return (value >= fromValue && value <= toValue);
	});

	$input.on('keyup change', function ()
	{
		table.draw();
	});
};