<?php

return [
    'dashboard' => '仪表板',
    '404'       => '不能找到此页面。',

    'auth'      => [
        'title'           => '验证',
        'username'        => '用户名',
        'password'        => '密码',
        'login'           => '登录',
        'logout'          => '登出',
        'wrong-username'  => '错误的用户名',
        'wrong-password'  => '密码错误',
        'since'           => '注册时间 :date',
    ],

    'model' => [
        'create'  => '创建 :title',
        'edit'    => '更新 :title',
    ],

    'links' => [
        'index_page' => '网站首页',
    ],

    'env_editor' => [
        'title' => 'ENV 编辑',
        'key' => '键',
        'var' => '值',
    ],

    'ckeditor' => [
        'upload' => [
            'success' => '文件上传成功: \\n- 大小: :size kb \\n- 宽度/高度: :width x :height',

            'error' => [
                'common' => '无法上传。',
                'wrong_extension' => '文件 ":file" 扩展名错误。',
                'filesize_limit' => '超过文件最大限制 :size kb.',
                'filesize_limit_m' => '超过文件最大限制 :size Mb.',
                'imagesize_max_limit' => '宽 x 高 = :width x :height \\n 超过最大宽高比: :maxwidth x :maxheight',
                'imagesize_min_limit' => '宽 x 高 = :width x :height \\n 最小宽高比: :minwidth x :minheight',
            ],
        ],

        'image_browser' => [
            'title' => '上传图片到服务器',
            'subtitle' => '选择图片',
        ],
    ],

    'table' => [
        'no-action' => '没有动作',
        'deleted_all' => '删除所选',
        'make-action' => '提交',
        'delete-confirm' => '您确定要删除此条目吗？',
        'action-confirm' => '你确定要做这个动作吗？',
        'delete-error' => '删除此条目时出错。 您必须先删除所有链接的条目。',
        'destroy-confirm' => '您确定要永久删除此条目吗？',
        'destroy-error' => '永久删除此条目时出错。 您必须先删除所有链接的条目。',
        'error' => '您的请求中出错',
        'filter' => '显示类似的条目',
        'filter-goto' => '显示',
        'save' => '保存',
        'all' => '全选',
        'processing' => '<i class="fas fa-spinner fa-5x fa-spin"></i>',
        'loadingRecords' => '载入...',
        'lengthMenu' => '显示 _MENU_ 项目',
        'zeroRecords' => '没有找到相关内容。',
        'info' => '从 _START_ 到 _END_ of _TOTAL_ 项',
        'infoEmpty' => '没有条目',
        'infoFiltered' => '(共筛选出 _MAX_ 项)',
        'infoThousands' => ',',
        'infoPostFix' => '',
        'search' => '查找 ',
        'emptyTable' => '没有内容',

        'paginate' => [
            'first' => '首页',
            'previous' => '&larr;',
            'next' => '&rarr;',
            'last' => '尾页',
        ],

        'filters' => [
            'control' => '筛选',
        ],
    ],

    'tree' => [
        'expand' => '展开全部',
        'collapse' => '全部收缩',
    ],

    'editable' => [
        'checkbox' => [
            'checked' => '是',
            'unchecked' => '否',
        ],
    ],

    'select' => [
        'nothing' => '没有选中',
        'selected' => '选',
        'placeholder' => '控制面板',
        'no_items'    => '没有项目',
        'init'        => '选',
        'empty'       => '空的',
        'limit'       => '还有 ${count} 以上',
        'more'       => '还有 :count 以上',
        'deselect'    => '取消',
        'short'       => '输入最小值 :min 人物',
    ],

    'image' => [
        'browse' => '选择图片',
        'browseMultiple' => '选择图片',
        'remove' => '移除图片',
        'removeMultiple' => '移除',
    ],

    'file' => [
        'browse' => '选择文件',
        'browseMultiple' => '选择文件',
        'remove' => '移除文件',
        'insert_link' => '插入连结',
    ],

    'button' => [
        'yes'       => '是',
        'no'        => '没有',
        'cancel'    => '取消',
        'save' => '保存',
        'new-entry' => '新增',
        'edit' => '编辑',
        'restore' => '还原',
        'delete' => '删除',
        'destroy' => '删除',
        'save_and_close' => '保存并关闭',
        'save_and_create' => '保存后新建其它项',
        'moveUp' => '上移',
        'moveDown' => '下移',
        'download' => '下载',
        'add' => '加',
        'remove' => '删除',
        'clear' => '清',
    ],

    'message' => [
        'created' => '创建成功！',
        'updated' => '更新成功！',
        'deleted' => '成功删除！',
        'destroyed' => '摧毁！',
        'restored' => '已还原！',
        'something_went_wrong' => '出问题了！',
        'are_you_sure' => '你确定吗？',
        'access_denied' => '拒绝访问',
        'validation_error' => '验证错误',
    ],

    'related' => [
        'unique' => '这种关系不是唯一的',
    ],

    'seo' => [
        'title' => '标题',
        'description' => '描述',
    ],
];
