<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Illuminate\Contracts\Validation\Factory;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Form\Element;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Translation\TranslatorInterface;

class FileElementController extends Controller
{
    /**
     * @var array
     */
    protected $elements = [
        'file' => Element\File::class,
        'image' => Element\Image::class,
    ];

    /**
     * @param Request $request
     * @param Factory $factory
     * @param ModelConfigurationInterface $model
     * @param TranslatorInterface $translator
     * @param string $type
     * @param string $field
     * @param int|null $id
     * @return JsonResponse
     */
    public function file(Request $request,
                         Factory $factory,
                         ModelConfigurationInterface $model,
                         TranslatorInterface $translator,
                         $type,
                         $field,
                         $id = null)
    {
        if (! array_key_exists($type, $this->elements)) {
            throw new NotFoundHttpException();
        }

        /** @var Element\File $static */
        $static = $this->elements[$type];

        if (! is_null($id)) {
            $item = $model->getRepository()->find($id);
            if (is_null($item) || ! $model->isEditable($item)) {
                return new JsonResponse([
                    'message' => $translator->trans('lang.message.access_denied'),
                ], 403);
            }

            $form = $model->fireEdit($id);
        } else {
            if (! $model->isCreatable()) {
                return new JsonResponse([
                    'message' => $translator->trans('lang.message.access_denied'),
                ], 403);
            }

            $form = $model->fireCreate();
        }

        $messages = [];
        $labels = [];
        $rules = $static::defaultUploadValidationRules();

        /** @var Element\File $element */
        if (! is_null($element = $form->getElement($field))) {
            $rules = $element->getUploadValidationRules();
            $messages = $element->getUploadValidationMessages();
            $labels = $element->getUploadValidationLabels();
        }

        /** @var Validator|\Illuminate\Validation\Validator $validator */
        $validator = $factory->make($request->all(), $rules, $messages, $labels);
        $static::validate($validator);

        if ($validator->fails()) {
            return new JsonResponse([
                'message' => $translator->trans('lang.message.validation_error'),
                'errors' => $validator->errors()->get('file'),
            ], 400);
        }

        $file = $request->file('file');

        /** @var Element\File $element */
        if (! is_null($element = $form->getElement($field))) {
            $filename = $element->getUploadFileName($file);
            $path = $element->getUploadPath($file);
            $settings = $element->getUploadSettings();
        } else {
            $filename = $static::defaultUploadFilename($file);
            $path = $static::defaultUploadPath($file);
            $settings = [];
        }

        $static::saveFile($file, public_path($path), $filename, $settings);

        $value = $path.'/'.$filename;

        return new JsonResponse([
            'url' => asset($value),
            'value' => $value,
        ]);
    }
}
