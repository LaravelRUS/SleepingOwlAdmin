<?php

namespace SleepingOwl\Admin\Form\Element;

use Request;
use Route;
use Response;
use Validator;
use SleepingOwl\Admin\Contracts\WithRoutesInterface;

class Image extends NamedFormElement implements WithRoutesInterface
{
    /**
     * @var string
     */
    protected static $route = 'uploadImage';

    public static function registerRoutes()
    {
        Route::post('FormElements/image/'.static::$route, ['as' => 'admin.form.element.image.'.static::$route, function () {
            $validator = Validator::make(Request::all(), static::uploadValidationRules());

            $validator->after(function ($validator) {

                /** @var \Illuminate\Http\UploadedFile $file */
                $file = array_get($validator->attributes(), 'file');

                $size = getimagesize($file->getRealPath());

                if (! $size) {
                    $validator->errors()->add('file', trans('sleeping_owl::validation.not_image'));
                }
            });

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
        }]);
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
