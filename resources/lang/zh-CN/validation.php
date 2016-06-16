<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | following language lines contain default error messages used by
    | validator class. Some of e rules have multiple versions such
    | as size rules. Feel free to tweak each of e messages here.
    |
    */

    'accepted'                => ':attribute 为 yes, on, 或是 1 时，验证才会通过。.',
    'active_url'              => ':attribute 链接不正确.',
    'after'                   => ':attribute 应该晚于 :date.',
    'alpha'                   => ':attribute 只能是字母字符串.',
    'alpha_dash'              => ':attribute 仅允许字母、数字、破折号（-）以及底线（_）.',
    'alpha_num'               => ':attribute 仅允许字母、数字.',
    'array'                   => ':attribute 应该是一个数组.',
    'before'                  => ':attribute 应该早于 :date.',
    'between'                 => [
        'numeric' => ':attribute 应介于 :min 与 :max.',
        'file'    => ':attribute 应介于 :min 与 :max kb.',
        'string'  => ':attribute 应介于 :min 与 :max 个字符.',
        'array'   => ':attribute 应介于 :min 与 :max 个元素.',
    ],
    'confirmed'               => ':attribute 不匹配.',
    'date'                    => ':attribute 日期不合法.',
    'date_format'             => ':attribute 格式不符合 :format.',
    'different'               => ':attribute 与 :o 不能相同.',
    'digits'                  => ':attribute 应是 :digits 位数字.',
    'digits_between'          => ':attribute 应介于 :min 与 :max 位.',
    'email'                   => ':attribute 邮件地址错误.',
    'exists'                  => ':attribute 已存在.',
    'image'                   => ':attribute 应该是图片.',
    'in'                      => ':attribute 无效.',
    'integer'                 => ':attribute 需为一个整数值.',
    'ip'                      => ':attribute 需符合 IP 位址格式.',
    'max'                     => [
        'numeric' => ':attribute 需小于等于 :max.',
        'file'    => ':attribute 文件需小于等于 :max kb.',
        'string'  => ':attribute 需小于等于 :max 字符.',
        'array'   => ':attribute 不可超过 :max 个元素.',
    ],
    'mimes'                   => ':attribute 文件类型必须是: :values.',
    'min'                     => [
        'numeric' => ':attribute 至少是 :min.',
        'file'    => ':attribute 不可少于 :min kb.',
        'string'  => ':attribute 不可少于 :min 字符.',
        'array'   => ':attribute 不可少于 :min 个元素.',
    ],
    'not_in'                  => ':attribute 不可选择.',
    'not_php'                 => '错误的文件.',
    'numeric'                 => ':attribute 必须是数字.',
    'regex'                   => ':attribute 格式错误.',
    'required'                => ':attribute 必填项目.',
    'required_only_on_create' => ':attribute 必填项目.',
    'required_if'             => '当 :o 是 :value 时,:attribute 是必填项目 .',
    'required_with'           => '当 :values 存在时，:attribute 必填项目.',
    'required_with_all'       => '当 :values 存在时，:attribute 必填项目.',
    'required_without'        => '当 :values 不存在时，:attribute 必填项目.',
    'required_without_all'    => '当 :values 不存在时，:attribute 必填项目.',
    'same'                    => ':attribute 与 :o 不匹配.',
    'size'                    => [
        'numeric' => ':attribute 大小应是 :size.',
        'file'    => ':attribute 大小应是 :size kb.',
        'string'  => ':attribute 大小应是 :size 字符.',
        'array'   => ':attribute 必须包含 :size 个元素.',
    ],
    'unique'                  => ':attribute 已存在.',
    'url'                     => ':attribute 格式错误.',
    'url_stub'                => ':attribute 格式错误.',
    'url_stub_full'           => ':attribute 格式错误.',
    'not_image'               => '当前不是图片文件',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | following language lines are used to swap attribute place-holders
    | with something more reader friendly such as E-Mail Address instead
    | of "email". This simply helps us make messages a little cleaner.
    |
    */

    'attributes' => [],

];
