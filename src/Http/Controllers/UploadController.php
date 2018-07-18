<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Routing\Controller;
use SleepingOwl\Admin\Form\Element\File;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UploadController extends Controller
{
    /**
     * @param Request $request
     * @param ModelConfigurationInterface $model
     * @param string $field
     * @param int|null $id
     *
     * @return JsonResponse
     */
    public function fromField(Request $request, ModelConfigurationInterface $model, $field, $id = null)
    {
        if (! is_null($id)) {
            $item = $model->getRepository()->find($id);
            if (is_null($item) || ! $model->isEditable($item)) {
                return new JsonResponse([
                    'message' => trans('lang.message.access_denied'),
                ], 403);
            }

            $form = $model->fireEdit($id);
        } else {
            if (! $model->isCreatable()) {
                return new JsonResponse([
                    'message' => trans('lang.message.access_denied'),
                ], 403);
            }

            $form = $model->fireCreate();
        }

        /** @var File $element */
        if (is_null($element = $form->getElement($field))) {
            throw new NotFoundHttpException("Field [{$field}] not found");
        }

        $rules = $element->getUploadValidationRules();
        $messages = $element->getUploadValidationMessages();
        $labels = $element->getUploadValidationLabels();

        /** @var \Illuminate\Contracts\Validation\Validator $validator */
        $validator = Validator::make($request->all(), $rules, $messages, $labels);

        $element->customValidation($validator);

        if ($validator->fails()) {
            return new JsonResponse([
                'message' => trans('lang.message.validation_error'),
                'errors'  => $validator->errors()->get('file'),
            ], 400);
        }

        $file = $request->file('file');

        $filename = $element->getUploadFileName($file);
        $path = $element->getUploadPath($file);
        $settings = $element->getUploadSettings();

        $result = $element->saveFile($file, $path, $filename, $settings);

        /* When driver not file */
        return new JsonResponse($result);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Contracts\View\Factory|\Illuminate\View\View|\Symfony\Component\HttpFoundation\Response
     */
    public function ckEditorStore(Request $request)
    {
        //dropZone && CKEDITOR fileBrowser && CKEDITOR drag&drop
        /** @var UploadedFile $file */
        $file = $request->image ? $request->image : $request->file;
        $file = $file ? $file : $request->upload;
        if (is_array($file)) {
            $file = $file[0];
        }

        $result = [];

        $extensions = collect(['jpe', 'jpeg', 'jpg', 'png', 'bmp', 'ico', 'gif']);

        if ($extensions->search($file->getClientOriginalExtension())) {
            $uploadFileName = md5(time().$file->getClientOriginalName()).'.'.$file->getClientOriginalExtension();

            $file->move(public_path(config('sleeping_owl.imagesUploadDirectory')), $uploadFileName);

            $result['url'] = asset(
                config('sleeping_owl.imagesUploadDirectory').'/'.$uploadFileName
            );
            $result['uploaded'] = 1;
            $result['fileName'] = $uploadFileName;

            if ($request->CKEditorFuncNum && $request->CKEditor && $request->langCode) {
                return app('sleeping_owl.template')
                    ->view('helper.ckeditor.ckeditor_upload_file', compact('result'));
            }

            if ($result) {
                return response($result);
            }
        }

        return response('Something wrong', 500);
    }
}
