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

    'accepted'                => 'Значение не принято.',
    'active_url'              => 'Адрес неверен.',
    'after'                   => 'Дата должна быть после :date.',
    'alpha'                   => 'Неверный формат.',
    'alpha_dash'              => 'Неверный формат.',
    'alpha_num'               => 'Неверный формат.',
    'array'                   => 'Должно быть массивом.',
    'before'                  => 'Дата должна быть до :date.',
    'between'                 => [
        'numeric' => 'Должно быть между :min и :max.',
        'file'    => 'Размер файла должен быть от :min до :max килобайт.',
        'string'  => 'Длина должна быть от :min до :max символов.',
        'array'   => 'Должно быть от :min до :max элементов.',
    ],
    'confirmed'               => 'Подтверждение этого поля не совпадает.',
    'date'                    => 'Неверная дата.',
    'date_format'             => 'Неверный формат.',
    'different'               => 'The :attribute and :other must be different.',
    'digits'                  => 'The :attribute must be :digits digits.',
    'digits_between'          => 'The :attribute must be between :min and :max digits.',
    'email'                   => 'The :attribute must be a valid email address.',
    'exists'                  => 'The selected :attribute is invalid.',
    'image'                   => 'Должно быть выбрано изображение (jpeg, png, gif, bmp).',
    'in'                      => 'The selected :attribute is invalid.',
    'integer'                 => 'The :attribute must be an integer.',
    'ip'                      => 'The :attribute must be a valid IP address.',
    'max'                     => [
        'numeric' => 'The :attribute may not be greater than :max.',
        'file'    => 'The :attribute may not be greater than :max kilobytes.',
        'string'  => 'The :attribute may not be greater than :max characters.',
        'array'   => 'The :attribute may not have more than :max items.',
    ],
    'mimes'                   => 'The :attribute must be a file of type: :values.',
    'min'                     => [
        'numeric' => 'The :attribute must be at least :min.',
        'file'    => 'The :attribute must be at least :min kilobytes.',
        'string'  => 'The :attribute must be at least :min characters.',
        'array'   => 'The :attribute must have at least :min items.',
    ],
    'not_in'                  => 'The selected :attribute is invalid.',
    'not_php'                 => 'Неверный тип файла.',
    'numeric'                 => 'The :attribute must be a number.',
    'regex'                   => 'Неверный формат поля.',
    'required'                => 'Необходимо заполнить это поле.',
    'required_only_on_create' => 'Необходимо заполнить это поле.',
    'required_if'             => 'The :attribute field is required when :other is :value.',
    'required_with'           => 'The :attribute field is required when :values is present.',
    'required_with_all'       => 'The :attribute field is required when :values is present.',
    'required_without'        => 'The :attribute field is required when :values is not present.',
    'required_without_all'    => 'The :attribute field is required when none of :values are present.',
    'same'                    => 'The :attribute and :other must match.',
    'size'                    => [
        'numeric' => 'The :attribute must be :size.',
        'file'    => 'The :attribute must be :size kilobytes.',
        'string'  => 'The :attribute must be :size characters.',
        'array'   => 'The :attribute must contain :size items.',
    ],
    'unique'                  => 'Это поле должно быть уникальным. Подобная запись уже существует.',
    'url'                     => 'The :attribute format is invalid.',
    'url_stub'                => 'Неверный формат поля.',
    'url_stub_full'           => 'Неверный формат поля.',
    'not_image'               => 'Файл не является изображением',

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
