<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use SleepingOwl\Admin\Form\Element\DependentSelect;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

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

    /**
     * @param Request $request
     * @param ModelConfigurationInterface $model
     * @param string $field
     * @param int|null $id
     *
     * @return JsonResponse
     */
    public function multiselectSearch(Request $request, ModelConfigurationInterface $model, $field, $id = null)
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

        $field = $request->field;
        $model = new $request->model;

        if ($request->q && is_object($model)) {
            return new JsonResponse(
                $model::where($request->field, 'like', "%{$request->q}%")
                    ->get()
                    ->map(function ($item) use ($field) {
                        return [
                            'tag_name'    => $item->{$field},
                            'id'          => $item->id,
                            'custom_name' => $item->custom_name,
                        ];
                    })
            );
        }
    }

    /**
     * @param Request $request
     * @param ModelConfigurationInterface $model
     * @param string $field
     * @param int|null $id
     *
     * @return JsonResponse
     */
    public function selectSearch(Request $request, ModelConfigurationInterface $model, $field, $id = null)
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

        $field = $request->field;
        $model = new $request->model;

        if ($request->q && is_object($model)) {
            return new JsonResponse(
                $model::where($request->field, 'like', "%{$request->q}%")
                    ->get()
                    ->map(function ($item) use ($field) {
                        return [
                            'tag_name'    => $item->{$field},
                            'id'          => $item->id,
                            'custom_name' => $item->custom_name,
                        ];
                    })
            );
        }
    }
}
