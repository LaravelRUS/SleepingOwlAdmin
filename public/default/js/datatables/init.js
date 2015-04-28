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
		var url;
		if (url = $this.data('url'))
		{
			params.serverSide = true;
			params.processing = true;
			params.ajax = {
				"url": url
			};
		}
		$this.DataTable(params);
	});
});