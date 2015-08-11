/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'tools' },
		{ name: 'undo'},
		{ name: 'clipboard', groups: [ 'clipboard' ] },
		{ name: 'forms' },
		'/',
		{ name: 'basicstyles'},
		{ name: 'insert', groups: ['insert', 'others'] },
		{ name: 'links'},
		{ name: 'paragraph', groups: [ 'list', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{ name: 'colors' }
	];

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	config.removeButtons = 'Anchor,Table,SpecialChar,HorizontalRule,Underline,Subscript,Superscript,Strike';

	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';

	CKEDITOR.config.simpleImageBrowserURL = '/' + window.admin.prefix + '/assets/images/all';
	CKEDITOR.config.language = window.admin.locale;
	config.filebrowserImageUploadUrl = '/' + window.admin.prefix + '/assets/images/upload';

	$.extend(config, window.admin.ckeditor_cfg);
};
