$(function ()
{
	// select active link in menu
	(function ()
	{
		var currentPage = window.location.href;
		currentPage = currentPage.replace(window.location.search, '');
		currentPage = currentPage.replace(/\/create$/, '');
		currentPage = currentPage.replace(/\/([0-9]+)\/edit/, '');

		var currentPageLink = $('#side-menu a[href="' + window.location.href + '"]');
		if ( ! currentPageLink.length)
		{
			currentPageLink = $('#side-menu a[href="' + currentPage + '"]');
		}
		currentPageLink.addClass('active').parents('li').addClass('active').end().parents('ul').addClass('collapse').addClass('in');
	})();

	// create tooltips
	(function ()
	{
		$('html').tooltip({
			selector: "[data-toggle=tooltip]",
			container: "body"
		})
	})();

	// autofocus first text input
	(function ()
	{
		$('input[type="text"]:first').focus();
	})();

});