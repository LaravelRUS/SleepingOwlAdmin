$(function ()
{
	$('.multiselect').multiselect({
		nonSelectedText: window.admin.lang.select.nothing,
		nSelectedText: window.admin.lang.select.selected,
		onChange: function(option, checked)
		{
			var select = this.$select;
			var type = select.data('select-type');
			var nullable = select.data('nullable');
			if (type == 'single' && nullable)
			{
				var values = [];
				select.find('option').each(function() {
					if ($(this).val() !== option.val()) {
						values.push($(this).val());
					}
				});
				this.deselect(values);
			}
		}
	});
});