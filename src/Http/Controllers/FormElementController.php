<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Form\Element\DependentSelect;

class FormElementController extends Controller
{
    /**
     * @param Request $request
     * @param ModelConfigurationInterface $model
     * @param string $field
     * @param int|null $id
     *
     * @return JsonResponse
     */
    public function dependentSelect(Request $request, ModelConfigurationInterface $model, $field, $id = null)
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

        /** @var DependentSelect $element */
        if (is_null($element = $form->getElement($field))) {
            return new JsonResponse([
                'message' => 'Element not found',
            ], 404);
        }

        $element->setAjaxParameters(
            $request->input('depdrop_all_params', [])
        );

        $options = $element->getOptions();

        if ($element->isNullable()) {
            $options = [null => trans('sleeping_owl::lang.select.nothing')] + $options;
        }

        return new JsonResponse([
            'output' => collect($options)->map(function ($value, $key) {
                return ['id' => $key, 'name' => $value];
            }),
            'selected' => $element->getValueFromModel(),
        ]);
    }
}