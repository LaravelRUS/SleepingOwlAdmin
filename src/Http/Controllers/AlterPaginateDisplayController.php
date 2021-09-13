<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Display\DisplayDatatablesAsyncAlterPaginate;
use SleepingOwl\Admin\Display\DisplayTab;
use SleepingOwl\Admin\Display\DisplayTabbed;
use SleepingOwl\Admin\Form\Columns\Column;
use SleepingOwl\Admin\Form\FormElements;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AlterPaginateDisplayController extends Controller
{
    /**
     * @param  ModelConfigurationInterface  $model
     * @param  Request  $request
     * @param  Application  $application
     * @param  null  $name
     * @return JsonResponse
     *
     * @throws NotFoundHttpException
     */
    public function async(ModelConfigurationInterface $model, Request $request, Application $application, $name = null)
    {
        $payload = $request->payload ?: [];

        $display = $model->fireDisplay($payload);

        if ($display instanceof DisplayTabbed) {
            $tabs = $display->getTabs();

            foreach ($tabs as $tab) {
                $content = $tab->getContent();

                if ($content instanceof FormElements) {
                    foreach ($content->getElements() as $element) {

                        //Return data-table if inside FormElements
                        if ($element instanceof DisplayDatatablesAsyncAlterPaginate) {
                            if ($element->getName() == $name) {
                                return $this->renderFindedTable($element, $application, $request);
                            }
                        }

                        //Try to find data table in columns
                        if ($element instanceof Column) {
                            foreach ($element->getElements() as $columnElement) {
                                if ($columnElement instanceof DisplayDatatablesAsyncAlterPaginate) {
                                    if ($columnElement->getName() == $name) {
                                        return $this->renderFindedTable($columnElement, $application, $request);
                                    }
                                }
                            }
                        }
                    }
                }

                //Finded trully in content-tab
                if ($content instanceof DisplayDatatablesAsyncAlterPaginate) {
                    if ($content->getName() == $name) {
                        return $this->renderFindedTable($content, $application, $request);
                    }
                }
            }
        }

        if ($display instanceof DisplayDatatablesAsyncAlterPaginate) {
            return $this->renderFindedTable($display, $application, $request);
        }

        abort(404);
    }

    /**
     * @param  ModelConfigurationInterface  $model
     * @param  Request  $request
     */
    public function treeReorder(ModelConfigurationInterface $model, Request $request)
    {
        $display = $model->fireDisplay();

        if ($display instanceof DisplayTabbed) {
            $display->getTabs()->each(function (DisplayTab $tab) use ($request) {
                $content = $tab->getContent();
                if ($content instanceof DisplayTree) {
                    $content->getRepository()->reorder(
                        $request->input('data')
                    );
                }
            });
        } else {
            $display->getRepository()->reorder(
                $request->input('data')
            );
        }
    }

    /**
     * @param  DisplayDatatablesAsyncAlterPaginate  $datatable
     * @param  Application  $application
     * @param  Request  $request
     * @return array|JsonResponse
     */
    protected function renderFindedTable(DisplayDatatablesAsyncAlterPaginate $datatable, Application $application, Request $request)
    {
        try {
            return $datatable->renderAsync($request);
        } catch (\Exception $exception) {
            \Log::error('unable to render finded table!', [
                'exception' => $exception,
            ]);

            return new JsonResponse([
                'message' => $application->isLocal()
                    ? $exception->getMessage()
                    : trans('sleeping_owl::lang.table.error'),
            ], 403);
        }
    }
}
