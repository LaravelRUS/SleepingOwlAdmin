<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Form\Element\DependentSelect;
use SleepingOwl\Admin\Form\Element\MultiDependentSelect;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;

class FormElementController extends Controller
{
    /**
     * @param ModelConfigurationInterface $model
     * @param null $id
     * @return JsonResponse|mixed
     */
    public function getModelLogic(ModelConfigurationInterface $model, $id = null)
    {
        if (! is_null($id)) {
            $item = $model->getRepository()->find($id);
            if (is_null($item) || ! $model->isEditable($item)) {
                return new JsonResponse([
                    'message' => trans('lang.message.access_denied'),
                ], 403);
            }

            return $model->fireEdit($id);
        }

        if (! $model->isCreatable()) {
            return new JsonResponse([
                'message' => trans('lang.message.access_denied'),
            ], 403);
        }

        return $model->fireCreate();
    }

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
        $form = $this->getModelLogic($model, $id);

        if ($form instanceof JsonResponse) {
            return $form;
        }

        // because field name in MultiDependentSelect ends with '[]'
        $fieldPrepared = str_replace('[]', '', $field);

        /** @var DependentSelect|MultiDependentSelect $element */
        $element = $form->getElement($fieldPrepared);

        if (is_null($element)) {
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
        return $this->selectSearch($request, $model, $field, $id);
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
        $form = $this->getModelLogic($model, $id);

        if ($form instanceof JsonResponse) {
            return $form;
        }

        // because field name in MultiDependentSelect ends with '[]'
        $fieldPrepared = str_replace('[]', '', $field);

        /** @var DependentSelect|MultiDependentSelect $element */
        $element = $form->getElement($fieldPrepared);

        if (is_null($element)) {
            return new JsonResponse([
                'message' => 'Element not found',
            ], 404);
        }

        //$field = $request->field;
        $model = new $request->model;
        $display = $element->getDisplay();
        $custom_name = $element->getCustomName();
        $exclude = $element->getExclude();

        if ($request->q && is_object($model)) {
            $query = $model->where($model->getTable().'.'.$request->search, 'like', "%{$request->q}%");

            if (count($exclude)) {
                $query = $query->whereNotIn($model->getTable().'.'.$model->getKeyName(), $exclude);
            }

            // call the pre load options query preparer if has be set
            if (is_callable($preparer = $element->getLoadOptionsQueryPreparer())) {
                $query = $preparer($this, $query);
            }

            return new JsonResponse(
                $query
                    ->get()
                    ->map(function (Model $item) use ($display, $custom_name) {
                        if (is_string($display)) {
                            $value = $item->{$display};
                        } elseif (is_callable($display)) {
                            $value = $display($item);
                        } else {
                            $value = null;
                        }
                        if (is_string($custom_name)) {
                            $custom_name_value = $item->{$custom_name};
                        } elseif (is_callable($custom_name)) {
                            $custom_name_value = $custom_name($item);
                        } else {
                            $custom_name_value = null;
                        }

                        return [
                            'tag_name' => $value,
                            'id' => $item->id,
                            'custom_name' => $custom_name_value,
                        ];
                    })
            );
        }
    }
}
