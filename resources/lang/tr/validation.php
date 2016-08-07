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

    'accepted' => ':attribute kabul edilmelidir.',
    'active_url' => ':attribute geçerli bir URL değil.',
    'after' => ':attribute :date tarihinden sonraki bir tarih olmalıdır.',
    'alpha' => ':attribute yalnızca harf içerebilir.',
    'alpha_dash' => ':attribute yalnızca harf, rakam ve çizgi içerebilir.',
    'alpha_num' => ':attribute yalnızca harf ve rakam içerebilir.',
    'array' => ':attribute dizi olmalıdır.',
    'before' => ':attribute :date tarihinden önceki bir tarih olmalıdır.',
    'between' => [
        'numeric' => ':attribute :min ve :max aralığında olmalıdır.',
        'file' => ':attribute :min ve :max kilobayt aralığında olmalıdır.',
        'string' => ':attribute :min ve :max karakter aralığında olmalıdır.',
        'array' => ':attribute :min ve :max aralığında öğe barındırmalıdır.',
    ],
    'boolean' => ':attribute alan sadece doğru ya da yanlış değeri alabilir.',
    'confirmed' => ':attribute doğrulama uyuşmadı.',
    'date' => ':attribute geçerli bir tarih değil.',
    'date_format' => ':attribute :format biçimiyle uyuşmuyor.',
    'different' => ':attribute ve :other birbirinden farklı olmalı.',
    'digits' => ':attribute :digits haneli olmalı.',
    'digits_between' => ':attribute :min ve :max aralığında hane içermeli.',
    'dimensions' => ':attribute geçersiz resim boyutuna sahip.',
    'distinct' => ':attribute alanı mükerrer değere sahip.',
    'email' => ':attribute geçerli bir e-posta adresi olmalı.',
    'exists' => 'seçili :attribute geçersizdir.',
    'filled' => ':attribute alanı gereklidir.',
    'image' => ':attribute resim olmak zorundadır.',
    'in' => 'seçili :attribute geçersizdir.',
    'in_array' => ':attribute alanı :other içersinde yer almıyor.',
    'integer' => ':attribute tam sayı olmak zorundadır.',
    'ip' => ':attribute geçerli bir IP adresi olmalıdır.',
    'json' => ':attribute geçerli bir JSON cümlesi olmalıdır.',
    'max' => [
        'numeric' => ':attribute :max değerinden daha büyük olamaz.',
        'file' => ':attribute :max değerinden daha fazla kilobayt olamaz.',
        'string' => ':attribute :max değerinden daha fazla karakter olamaz.',
        'array' => ':attribute :max değerinden daha fazla öğe içeremez.',
    ],
    'mimes' => ':attribute dosyasının sahip olması gereken dosya tipi: :values.',
    'min' => [
        'numeric' => ':attribute en azından :min olmalıdır.',
        'file' => ':attribute en azından :min kilobayt olmalıdır.',
        'string' => ':attribute en azından :min karakter olmalıdır.',
        'array' => ':attribute en azından :min öğe barındırmalıdır.',
    ],
    'not_in' => 'seçili :attribute geçersizdir.',
    'numeric' => ':attribute sayı olmak zorundadır.',
    'present' => ':attribute alanı bulunmak zorundadır.',
    'regex' => ':attribute biçim geçersiz.',
    'required' => ':attribute alanı gereklidir.',
    'required_if' => ':attribute alanı :other :value olduğunda gereklidir.',
    'required_unless' => ':attribute alanı :other :values içersinde yer aldığı sürece gereklidir .',
    'required_with' => ':attribute alanı :values yer aldığı sürece gereklidir.',
    'required_with_all' => ':attribute alanı :values yer aldığı sürece gereklidir.',
    'required_without' => ':attribute alanı :values yer almadığı sürece gereklidir.',
    'required_without_all' => ':attribute alanı gereklidir when none of :values are present.',
    'same' => ':attribute ve :other uyuşmalıdır.',
    'size' => [
        'numeric' => ':attribute :size olmalıdır.',
        'file' => ':attribute :size kilobayt olmalıdır.',
        'string' => ':attribute :size karakter olmalıdır.',
        'array' => ':attribute :size adet öğe içermelidir.',
    ],
    'string' => ':attribute yazı olmalıdır.',
    'timezone' => ':attribute geçerli bir zaman dilimi olmalıdır.',
    'unique' => ':attribute önceden kullanılmış.',
    'url' => ':attribute biçimi geçersiz.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

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
