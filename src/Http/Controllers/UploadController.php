<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Routing\Controller;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Form\Element\File;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Validator;

class UploadController extends Controller
{
    private $uploadFilenameBehaviors = [
        'UPLOAD_HASH', // Использовать Хеш файла

        'UPLOAD_ORIGINAL_ALERT', // Если такой файл есть - сообщать об этом
        'UPLOAD_ORIGINAL_ADD_HASH', // Если такой файл есть - добавляем хеш f.png -> f_jfhsjfy8s7df8a7.png
        'UPLOAD_ORIGINAL_ADD_INCREMENT', // Если такой файл есть - инкрементировать имя, пока не найдется вариант f.png -> f_1.png ... f_10.png

        'UPLOAD_ORIGINAL_REWRITE', // Если такой файл есть - просто перезаписываем.
    ];

    private $uploadFilenameBehaviorDefault = 'UPLOAD_HASH'; // По умолчанию
    private $uploadFilenameIncrementMax = 10; // Максимально число попыток для подбора инкремента. f_10.png не будет создан

    /**
     * @param  Request  $request
     * @param  ModelConfigurationInterface  $model
     * @param  string  $field
     * @param  int|null  $id
     * @return JsonResponse
     */
    public function fromField(Request $request, ModelConfigurationInterface $model, $field, $id = null)
    {
        if (! is_null($id)) {
            $item = $model->getRepository()->find($id);
            if (is_null($item) || ! $model->isEditable($item)) {
                return new JsonResponse([
                    'message' => trans('sleeping_owl::lang.message.access_denied'),
                ], 403);
            }

            $form = $model->fireEdit($id);
        } else {
            if (! $model->isCreatable()) {
                return new JsonResponse([
                    'message' => trans('sleeping_owl::lang.message.access_denied'),
                ], 403);
            }

            $form = $model->fireCreate();
        }

        /*
         * @var File
         */
        if (is_null($element = $form->getElement($field))) {
            throw new NotFoundHttpException("Field [{$field}] not found");
        }

        $rules = $element->getUploadValidationRules();
        $messages = $element->getUploadValidationMessages();
        $labels = $element->getUploadValidationLabels();

        /**
         * @var \Illuminate\Contracts\Validation\Validator
         */
        $validator = Validator::make($request->all(), $rules, $messages, $labels);

        $element->customValidation($validator);

        if ($validator->fails()) {
            return new JsonResponse([
                'message' => trans('sleeping_owl::lang.message.validation_error'),
                'errors' => $validator->errors()->get('file'),
            ], 400);
        }

        $file = $request->file('file');

        $filename = $element->getUploadFileName($file);
        $path = $element->getUploadPath($file);
        $settings = $element->getUploadSettings();

        $result = $element->saveFile($file, $path, $filename, $settings);

        /*
         * When driver not file
         */
        return new JsonResponse($result);
    }

    /**
     * @param  Request  $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Contracts\View\Factory|\Illuminate\View\View|\Symfony\Component\HttpFoundation\Response
     */
    public function ckEditorStore(Request $request)
    {
        /**
         * dropZone && CKEDITOR fileBrowser && CKEDITOR drag&drop.
         *
         * @var UploadedFile
         */
        $file = $request->image ? $request->image : $request->file;
        $file = $file ? $file : $request->upload;
        if (is_array($file)) {
            $file = $file[0];
        }

        $result = [];

        $imagesAllowedExtensions = collect(
            config('sleeping_owl.imagesAllowedExtensions', ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'])
        );

        if ($imagesAllowedExtensions->search($file->getClientOriginalExtension()) !== false) {
            $uploadDirectory = config('sleeping_owl.imagesUploadDirectory');
            $uploadFilenameBehavior = config('sleeping_owl.imagesUploadFilenameBehavior', $this->uploadFilenameBehaviorDefault);
            $result = $this->uploadFile($file, $uploadDirectory, $uploadFilenameBehavior);
        }

        $filesAllowedExtensions = collect(
            config('sleeping_owl.filesAllowedExtensions', [])
        );

        if ($filesAllowedExtensions->search($file->getClientOriginalExtension()) !== false) {
            $uploadDirectory = config('sleeping_owl.filesUploadDirectory');
            $uploadFilenameBehavior = config('sleeping_owl.filesUploadFilenameBehavior', $this->uploadFilenameBehaviorDefault);
            $result = $this->uploadFile($file, $uploadDirectory, $uploadFilenameBehavior);
        }

        if ($result && $result['uploaded'] == 1) {
            if ($request->CKEditorFuncNum && $request->CKEditor && $request->langCode) {
                return app('sleeping_owl.template')
                    ->view('helper.ckeditor.ckeditor_upload_file', compact('result'));
            }

            return response($result);
        }

        if ($result && $result['uploaded'] == 0) {
            return response($result, 500);
        }

        return response('Something wrong', 500);
    }

    /**
     * @param  UploadedFile  $file
     * @param  string  $uploadDirectory
     * @param  string  $uploadFilenameBehavior
     * @return array
     */
    private function uploadFile(UploadedFile $file, string $uploadDirectory, string $uploadFilenameBehavior): array
    {
        $isFileExists = file_exists(public_path($uploadDirectory).DIRECTORY_SEPARATOR.$file->getClientOriginalName());
        $uploadFileName = $file->getClientOriginalName();

        $filenameWithoutExtensions = substr($file->getClientOriginalName(), 0, strrpos($file->getClientOriginalName(), '.'));

        //Варианты
        switch ($uploadFilenameBehavior) {
            case 'UPLOAD_ORIGINAL_ALERT':
                if ($isFileExists) {
                    $result['uploaded'] = 0;
                    $result['error']['message'] = 'Файл с таким именем уже существует. Измените имя файла и попробуйте еще раз';
                    $uploadFileName = false;
                }
                break;
            case 'UPLOAD_ORIGINAL_ADD_HASH':
                if ($isFileExists) {
                    $uploadFileName = $filenameWithoutExtensions
                        .'_'.md5(time().$filenameWithoutExtensions)
                        .'.'.$file->getClientOriginalExtension();
                    $result['error']['message'] = "Файл с таким именем уже существовал. Загружаемый файл был переименован в '{$uploadFileName}'";
                }
                break;
            case 'UPLOAD_ORIGINAL_ADD_INCREMENT':
                if ($isFileExists) {
                    $index = 1;
                    $uploadFileName = $filenameWithoutExtensions.'_'.$index.'.'.$file->getClientOriginalExtension();
                    while (
                        file_exists(public_path($uploadDirectory).DIRECTORY_SEPARATOR.$uploadFileName)
                        and
                        $index < $this->uploadFilenameIncrementMax
                    ) {
                        $index++;
                        $uploadFileName = $filenameWithoutExtensions.'_'.$index.'.'.$file->getClientOriginalExtension();
                    }
                    $result['error']['message'] = "Файл с таким именем уже существовал. Загружаемый файл был переименован в '{$uploadFileName}'";
                    if ($index == $this->uploadFilenameIncrementMax) {
                        $uploadFileName = false;
                        $result['uploaded'] = 0;
                        $result['error']['message'] = 'Файл с таким именем уже существовал. Имя подобрать не удалось. Переименуйте файл и попробуйте еще раз';
                    }
                }
                break;
            case 'UPLOAD_ORIGINAL_REWRITE':
                if ($isFileExists) {
                    $result['error']['message'] = 'Файл с таким именем уже существовал и был перезаписан';
                }
                break;
            default:
                //UPLOAD_HASH
                $uploadFileName = md5(time().$filenameWithoutExtensions).'.'.$file->getClientOriginalExtension();
                $result['error']['message'] = "Файл был переименован в '{$uploadFileName}'";
                break;
        }

        if ($uploadFileName) {
            $file->move(public_path($uploadDirectory), $uploadFileName);

            $result['uploaded'] = 1;
            $result['url'] = asset($uploadDirectory.'/'.$uploadFileName);
            $result['fileName'] = $uploadFileName;
        }

        return $result;
    }
}
