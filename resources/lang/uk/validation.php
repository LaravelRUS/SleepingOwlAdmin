<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted'                => 'Значення не принято.',
    'active_url'              => 'Адрес неправильний.',
    'after'                   => 'Дата повинна бути після :date.',
    'alpha'                   => 'Неправильний формат.',
    'alpha_dash'              => 'Неправильний формат.',
    'alpha_num'               => 'Неправильний формат.',
    'array'                   => 'Повинна бути масивом.',
    'before'                  => 'Дата Повинна бути до :date.',
    'between'                 => [
        'numeric' => 'Повинно бути між :min и :max.',
        'file'    => 'Розмір файла повинен бути від :min до :max кілобайт.',
        'string'  => 'Довжина повинна бути від :min до :max символів.',
        'array'   => 'Повинно бути від :min до :max елементів.',
    ],
    'confirmed'               => 'Підтвердження цього поля не співпадає.',
    'date'                    => 'Неправильна дата.',
    'date_format'             => 'Неправильний формат.',
    'different'               => ':attribute і :other мають бути різними.',
    'digits'                  => ':attribute повинна бути :digits цифровою.',
    'digits_between'          => ':attribute повиннен бути між :min і :max числами.',
    'email'                   => ':attribute email має бути справжнім.',
    'exists'                  => 'Вибраний :attribute є неправильним.',
    'image'                   => 'Зображення повинно бути в форматі (jpeg, png, gif, bmp).',
    'in'                      => 'Вибраний :attribute є неправильним.',
    'integer'                 => ':attribute має бути цілим числом',
    'ip'                      => ':attribute має бути справжнім IP адресом.',
    'max'                     => [
        'numeric' => ':attribute може бути не більшим ніж :max.',
        'file'    => ':attribute може бути не більшим ніж :max кілобайт.',
        'string'  => ':attribute має мати не більше ніж :max символів.',
        'array'   => ':attribute може мати не більше ніж :max пунктів.',
    ],
    'mimes'                   => ':attribute має бути файлом у форматі: :values.',
    'min'                     => [
        'numeric' => ':attribute має бути принаймні, :min.',
        'file'    => ':attribute має бути принаймні, :min кілобайт.',
        'string'  => ':attribute має бути принаймні, :min символів.',
        'array'   => ':attribute має мати принаймні, :min пунтків.',
    ],
    'not_in'                  => 'Вибраний :attribute є неправильним.',
    'not_php'                 => 'Направильний тип файла.',
    'numeric'                 => ':attribute має бути номером.',
    'regex'                   => 'Неправильний формат поля.',
    'required'                => 'Необхідно заповнити це поле.',
    'required_only_on_create' => 'Необхідно заповнити це поле.',
    'required_if'             => ':attribute поле обов\'язкове для заповнення, коли :other є :value.',
    'required_with'           => ':attribute поле обов\'язкове для заповнення, коли :values є вибраним.',
    'required_with_all'       => ':attribute поле обов\'язкове для заповнення, коли :values є вибраним.',
    'required_without'        => ':attribute поле обов\'язкове для заповнення, коли :values не вибраний.',
    'required_without_all'    => ':attribute поле обов\'язкове для заповнення, коли жоден з :values не вибрано.',
    'same'                    => ':attribute і :other повинні співпадати.',
    'size'                    => [
        'numeric' => 'The :attribute повинен бути :size.',
        'file'    => 'The :attribute повинен бути :size кілобайт.',
        'string'  => 'The :attribute повинен бути :size символів.',
        'array'   => 'The :attribute повинен мати :size пунктів.',
    ],
    'unique'                  => 'Це поле має бути унікальним. Така запись вже існує.',
    'url'                     => ':attribute неправильного формату.',
    'url_stub'                => 'Неправильний формат поля.',
    'url_stub_full'           => 'Неправильний формат поля.',
    'not_image'               => 'Файл не являється зображенням',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap attribute place-holders
    | with something more reader friendly such as E-Mail Address instead
    | of "email". This simply helps us make messages a little cleaner.
    |
    */

    'attributes' => [],

];
