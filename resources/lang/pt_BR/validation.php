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

    'accepted'                => ':attribute deve ser aceito.',
    'active_url'              => ':attribute não é uma URL válida.',
    'after'                   => ':attribute deve ser uma data depois de :date.',
    'alpha'                   => ':attribute somente pode conter letras.',
    'alpha_dash'              => ':attribute somente pode conter letras, números, e traços.',
    'alpha_num'               => ':attribute somente pode conter letras e números.',
    'array'                   => ':attribute deve ser um array.',
    'before'                  => ':attribute deve ser uma data antes de :date.',
    'between'                 => [
        'numeric' => ':attribute deve estar entre :min e :max.',
        'file'    => ':attribute deve estar entre :min e :max kilobytes.',
        'string'  => ':attribute deve estar entre :min e :max caracteres.',
        'array'   => ':attribute deve estar entre :min e :max items.',
    ],
    'confirmed'               => ':attribute confirmação não combina.',
    'date'                    => ':attribute não é uma data válida.',
    'date_format'             => ':attribute não combina com o formato :format.',
    'different'               => ':attribute e :other devem ser diferentes.',
    'digits'                  => ':attribute deve ter :digits dígitos.',
    'digits_between'          => ':attribute deve ter entre :min e :max dígitos.',
    'email'                   => ':attribute deve ser um endereço de email válido.',
    'exists'                  => 'A seleção :attribute é inválida.',
    'image'                   => ':attribute deve ser uma imagem.',
    'in'                      => 'A seleção :attribute é inválida.',
    'integer'                 => ':attribute deve ser um inteiro.',
    'ip'                      => ':attribute deve ser um endereço de IP válido.',
    'max'                     => [
        'numeric' => ':attribute não pode ser maior que :max.',
        'file'    => ':attribute não pode ser maior que :max kilobytes.',
        'string'  => ':attribute não pode ser maior que :max caracteres.',
        'array'   => ':attribute não pode ter mais que :max items.',
    ],
    'mimes'                   => ':attribute deve ser um campo do tipo: :values.',
    'min'                     => [
        'numeric' => ':attribute dever ser no mínimo :min.',
        'file'    => ':attribute dever ter no mínimo :min kilobytes.',
        'string'  => ':attribute dever ter no mínimo :min caracteres.',
        'array'   => ':attribute dever ter no mínimo :min items.',
    ],
    'not_in'                  => 'A seleção :attribute é inválida.',
    'not_php'                 => 'Tipo de arquivo errado.',
    'numeric'                 => ':attribute deve ser um número.',
    'regex'                   => ':attribute com formato inválido.',
    'required'                => 'Campo :attribute é obrigatório.',
    'required_only_on_create' => 'Campo :attribute é obrigatório.',
    'required_if'             => 'Campo :attribute é obrigatório quando :other é :value.',
    'required_with'           => 'Campo :attribute é obrigatório quando :values está presente.',
    'required_with_all'       => 'Campo :attribute é obrigatório quando :values está presente.',
    'required_without'        => 'Campo :attribute é obrigatório quando :values não está presente.',
    'required_without_all'    => 'Campo :attribute é obrigatório quando nenhum :values está resente.',
    'same'                    => ':attribute e :other devem combinar.',
    'size'                    => [
        'numeric' => ':attribute deve ser :size.',
        'file'    => ':attribute deve ter :size kilobytes.',
        'string'  => ':attribute deve ter :size caracteres.',
        'array'   => ':attribute deve conter :size items.',
    ],
    'unique'                  => ':attribute já foi utilizado.',
    'url'                     => ':attribute esté com o formato inválido.',
    'url_stub'                => ':attribute esté com o formato inválido.',
    'url_stub_full'           => ':attribute esté com o formato inválido.',

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

    'attributes'              => [],

];
