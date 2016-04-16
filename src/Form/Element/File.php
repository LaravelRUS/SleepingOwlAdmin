<?php

namespace SleepingOwl\Admin\Form\Element;

use Request;
use Route;
use Response;
use Validator;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;

class File extends NamedFormElement implements WithRoutesInterface
{
    /**
     * @var string
     */
    protected static $route = 'uploadFile';

    public static function registerRoutes()
    {
        Route::post('FormElements/image/'.static::$route, ['as' => 'admin.form.element.file.'.static::$route, function () {
                $validator = Validator::make(Request::all(), static::uploadValidationRules());

                static::uploadValidationRules($validator);

                if ($validator->fails()) {
                    return Response::make($validator->errors()->get('file'), 400);
                }

                $file = Request::file('file');
                $filename = md5(time().$file->getClientOriginalName()).'.'.$file->getClientOriginalExtension();
                $path = static::getUploadPath();
                $fullPath = public_path($path);
                $file->move($fullPath, $filename);

                $value = $path.'/'.$filename;

                return [
                    'url' => asset($value),
                    'value' => $value,
                ];
            },
        ]);
    }

    /**
     * @param \Illuminate\Validation\Validator $validator
     */
    protected static function validate(\Illuminate\Validation\Validator $validator)
    {
    }

    /**
     * @return string
     */
    protected static function getUploadPath()
    {
        return config('sleeping_owl.filesUploadDirectory', 'files/uploads');
    }

    /**
     * @return array
     */
    protected static function uploadValidationRules()
    {
        return [
            'file' => 'required',
        ];
    }
}
