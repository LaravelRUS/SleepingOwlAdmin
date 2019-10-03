import Sortable from 'sortablejs';
import Flow from '@flowjs/flow.js';

$(function ()
{
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

    $('.fileUploadMultiple').each(function (index, item)
    {
        var $item = $(item);
        var RenderFileTpl = $item.find('.RenderFile').first().html();
        var $innerGroup = $item.find('.files-group');
        var $input = $item.find('.fileValue');

        var flow = new Flow({
            target: $item.data('target'),
            testChunks: false,
            chunkSize: 1024 * 1024 * 1024,
            query: {
                _token: $item.data('token')
            }
        });

        var updateValue = function ()
        {
            var values = [];
            $item.find('.thumbnail').each(function (index, thumb) {
                var $thumb = $(thumb);
                values.push({
                    url: $($thumb.find('[data-id=file]')[0]).data('src'),
                    title: $($thumb.find('[data-id=title]')[0]).val(),
                    desc: $($thumb.find('[data-id=description]')[0]).val()
                });
            });
            $input.val(JSON.stringify(values));
        };

        var baseName = function (str)
        {
            var base = new String(str).substring(str.lastIndexOf('/') + 1);
            if(base.lastIndexOf(".") != -1) {
                base = base.substring(0, base.lastIndexOf("."));
            }
            return base;
        };

        var urlItem = function (src, url) {
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
                num: (new Date).getTime()
            });
        };

        flow.assignBrowse($item.find('.fileBrowse'));

        flow.on('filesSubmitted', function(file) {
            flow.upload();
            updateValue();
        });

        $('.tit').on('change', function () {
            updateValue();
        });

        $('.desc').on('change', function () {
            updateValue();
        });

        flow.on('fileSuccess', function(file,message){
            flow.removeFile(file);
            var result = $.parseJSON(message);
            $innerGroup.append( urlItem(result.value, result.path) );

            var buttons = document.querySelectorAll('.tit');
            for (var i = 0; i < buttons.length; i++) {
                var self = buttons[i];
                self.addEventListener('change', function (event) {
                    updateValue();
                }, false);
            }

            buttons = document.querySelectorAll('.desc');
            for (i = 0; i < buttons.length; i++) {
                self = buttons[i];
                self.addEventListener('change', function (event) {
                    updateValue();
                }, false);
            }

            updateValue();
        });

        $item.on('click', '.fileRemove', function (e)
        {
            e.preventDefault();
            $(this).closest('.fileThumbnail').remove();
            updateValue();
        });

        Sortable.create($innerGroup[0], { onUpdate: function () { updateValue(); } });
        updateValue();
    });
});