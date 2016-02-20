<?php

namespace SleepingOwl\Admin\FormItems;

use Request;
use Route;
use Response;
use Validator;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;

class Image extends NamedFormItem implements WithRoutesInterface
{
    /**
     * @var string
     */
    protected static $route = 'uploadImage';

    public static function registerRoutes()
    {
        Route::post('formitems/image/'.static::$route, ['as' => 'admin.formitems.image.'.static::$route,
            function () {
                $validator = Validator::make(Request::all(), static::uploadValidationRules());
                if ($validator->fails()) {
                    return Response::make($validator->errors()->get('file'), 400);
                }

                $file = Request::file('file');
                $filename = md5(time().$file->getClientOriginalName()).'.'.$file->getClientOriginalExtension();
                $path = config('sleeping_owl.imagesUploadDirectory');
                $fullpath = public_path($path);
                $file->move($fullpath, $filename);
                $value = $path.'/'.$filename;

                return [
                    'url'   => asset($value),
                    'value' => $value,
                ];
            },
        ]);
    }

    /**
     * @return array
     */
    protected static function uploadValidationRules()
    {
        return [
            'file' => 'image',
        ];
    }
}
