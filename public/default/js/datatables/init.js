$(function ()
{
	$.fn.dataTable.ext.errMode = function ()
	{
		$.notify(window.admin.lang.table.error, 'error');
	};
	$('.datatables').each(function ()
	{
		var $this = $(this);
		var params = {
			language: window.admin.lang.table,
			stateSave: true,
			lengthMenu: [
				[10, 25, 50, -1],
				[10, 25, 50, window.admin.lang.table.all]
			]
		};
		params = $.extend(params, $this.data('attributes'));

		var url;
		if (url = $this.data('url'))
		{
			params.serverSide = true;
			params.processing = true;
			params.ajax = {
				url: url,
				data: function (d)
				{
					$this.find('.column-filter').each(function ()
					{
						var $this = $(this);
						var index = $this.closest('td').data('index');
						if (name = $this.data('ajax-data-name'))
						{
							d.columns[index]['search'][name] = $this.val();
						}
					});
				}
			};
		}
		var table = $this.DataTable(params);

		$this.find('.column-filter').each(function ()
		{
			if ($(this).parent().closest('.column-filter').length > 0) return;
			var type = $(this).data('type');
			window.columnFilters[type](this, table);
		});
	});
});