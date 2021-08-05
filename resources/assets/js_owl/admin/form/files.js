import Sortable from 'sortablejs';
import Flow from '@flowjs/flow.js';

$(function () {
    function renderTPL(template, data) {
        var out = '';
        if (template != '') {
            out = template.replace(/[\r\t\n]/g, " ")
                .split("[%").join("\t")
                .replace(/((^|%])[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)%]/g, "',$1,'")
                .split("\t").join("');")
                .split("%]").join("p.push('")
                .split("\r").join("\\'");
            out = new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"
                + out
                + "');}return p.join('');")(data);
        }
        return out;
    }

    $('.fileUploadMultiple').each(function (index, item) {
        var $item = $(item);
        var RenderFileTpl = $item.find('.RenderFile').first().html();

        var $innerGroup = $item.find('.files-group').not(".dissortable");
        var $input = $item.find('.fileValue');

        var $fileBrowse = $item.find('.fileBrowse');
        var $ajaxLoader = $fileBrowse.find('.fa-spin');

        var flow = new Flow({
            target: $item.data('target'),
            testChunks: false,
            chunkSize: 1024 * 1024 * 1024,
            query: {
                _token: $item.data('token')
            }
        });

        var updateValue = function () {
            var values = [];
            $item.find('.thumbnail').each(function (index, thumb) {
                var $thumb = $(thumb);
                values.push({
                    url: $($thumb.find('[data-id=file]')[0]).data('src'),
                    title: $($thumb.find('[data-id=title]')[0]).val(),
                    desc: $($thumb.find('[data-id=description]')[0]).val(),
                    orig: $($thumb.find('[data-id=original_name]')[0]).val()
                });
            });
            $input.val(JSON.stringify(values));

            $('[data-toggle="tooltip"]').tooltip()
        };

        var baseName = function (str) {
            var base = new String(str).substring(str.lastIndexOf('/') + 1);
            if (base.lastIndexOf(".") != -1) {
                base = base.substring(0, base.lastIndexOf("."));
            }
            return base;
        };

        var urlItem = function (result) {
            var src = result.value;
            var url = result.path;
            var orig = result.original_name;
            var images_extensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'tiff', 'webp'];
            var ext = src.split('.').pop();
            var img = null;
            var mime = null;
            var lightbox_style = 'display:none';
            url = url || '/' + src;
            if (images_extensions.indexOf(ext) != -1) {
                img = url;
                ext = null;
                mime = null;
                lightbox_style = null;
            }
            return renderTPL(RenderFileTpl, {
                src: src,
                url: url,
                basename: baseName(src),
                img: img,
                ext: ext,
                mime: mime,
                lightbox_style: lightbox_style,
                num: (new Date).getTime(),
                orig: orig
            });
        };

        flow.assignBrowse($fileBrowse);
        flow.assignDrop($fileBrowse);

        flow.on('filesSubmitted', function (file) {
            // console.log('filesSubmitted');
            $ajaxLoader.css('display', 'inline-block');
            flow.upload();
            updateValue();
        });

        $('.tit').on('change', function () {
            updateValue();
        });

        $('.desc').on('change', function () {
            updateValue();
        });

        flow.on('fileSuccess', function (file, message) {
            // console.log('fileSuccess');
            flow.removeFile(file);
            if (!flow.files.length) {
                $ajaxLoader.css('display', 'none');
            }

            try {
                var response = $.parseJSON(message);
            } catch(e) {
                Admin.Messages.error(trans('lang.ckeditor.upload.error.common'))
                return false;
            }

            $innerGroup.append(urlItem(response));

            var buttons = document.querySelectorAll('.tit');

            $(buttons[(buttons.length-1)]).val(response.title);
            for (var i = 0; i < buttons.length; i++) {
                var self = buttons[i];
                self.addEventListener('change', function (event) {
                    updateValue();
                }, false);
            }

            buttons = document.querySelectorAll('.desc');
            $(buttons[(buttons.length-1)]).val(response.desc);
            for (i = 0; i < buttons.length; i++) {
                self = buttons[i];
                self.addEventListener('change', function (event) {
                    updateValue();
                }, false);
            }

            updateValue();
        });

        flow.on('fileError', function(file, message, chunk){
            // console.log('fileError');
            flow.removeFile(file);
            if (!flow.files.length) {
                $ajaxLoader.css('display', 'none');
            }
            /*
             * 200 - all is ok
             * 400 - as well as validation
             * 419 - bad csrf token
             * 500 - server side error
             */
            let xhrStatus = chunk.xhr.status;
            // console.log(file, message, chunk, xhrStatus, flow.files);
            try {
                var response = $.parseJSON(message);
            } catch(e) {
                Admin.Messages.error(trans('lang.ckeditor.upload.error.common'))
                return false;
            }
            if (response.errors[0]) {
                Admin.Messages.error(response.message, response.errors[0])
            } else {
                Admin.Messages.error(trans('lang.ckeditor.upload.error.common'))
                return false;
            }

            return true;
        });

        $item.on('click', '.fileLink', function (e) {
            e.preventDefault();
            var url = $(this).attr('href');
            Admin.Messages.prompt(trans('lang.file.insert_link'), null, null, url, url).then(result => {
                if (result.value) {
                    var $thumbReload = $(this).parents('.thumbnail');
                    $($thumbReload.find('[data-id=file]')).data('src', result.value);
                    $($thumbReload.find('.file-image')).attr('href', result.value);
                    $($thumbReload.find('.fileicon-inner')).css('background-image', 'url("' + result.value + '")');
                    updateValue();
                } else {
                    return false;
                }
            });
        });

        $item.on('click', '.fileRemove', function (e) {
            e.preventDefault();
            $(this).closest('.fileThumbnail').remove();
            updateValue();
        });

        // dragable
        Sortable.create($innerGroup[0], {
            sort: $($innerGroup[0]).data('draggable'),
            handle: '.drag-handle',
            onUpdate: function () {
                updateValue();
            }
        });
        updateValue();
    });
});
