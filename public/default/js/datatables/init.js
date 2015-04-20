$(function ()
{
	var params = {
		language: window.admin.lang.table,
		stateSave: true,
		lengthMenu: [
			[10, 25, 50, -1],
			[10, 25, 50, window.admin.lang.table.all]
		]
	};
	$('.datatables').DataTable(params);
});