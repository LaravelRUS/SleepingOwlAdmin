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
        $routeName = 'admin.form.element.file.'.static::$route;
        if (! Route::has($routeName)) {
            Route::post('FormElements/image/'.static::$route, ['as' => $routeName, function () {
                $validator = Validator::make(Request::all(), static::uploadValidationRules());

                static::uploadValidationRules($validator);

                if ($validator->fails()) {
                    return Response::make($validator->errors()->get('file'), 400);
                }

                $file = Request::file('file');
                $filename = md5(time().$file->getClientOriginalName()).'.'.$file->getClientOriginalExtension();
                $path = static::getUploadPath();
                $fullPath = public_path($path);
                
                $value = $path.'/'.$filename;
                $envFile = config('filesystems.default', 'local')=='local';
                if($envFile){
                    $move2Path = $file->move($fullPath, $filename);
                    $value = $path.'/'.$filename;
                }else{
                    $move2Path = \Storage::put(
                        $value,
                        file_get_contents($file->getRealPath())//
                    );
                }
                if (!$move2Path) {
                    return Response::make($validator->errors()->get('file'), 400);
                }
                return [
                        'url' => $envFile?asset($value):'http://'.config('filesystems.disks.'.config('filesystems.default').'.domain').'/'.$value,
                        'value' => $value,
                    ];
                }]);
        }
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
