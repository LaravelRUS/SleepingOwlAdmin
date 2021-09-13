<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Display\DisplayDatatablesAsync;
use SleepingOwl\Admin\Display\DisplayTab;
use SleepingOwl\Admin\Display\DisplayTabbed;
use SleepingOwl\Admin\Display\DisplayTree;
use SleepingOwl\Admin\Form\Columns\Column;
use SleepingOwl\Admin\Form\FormElements;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DisplayController extends Controller
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

                        /*
                          * Return data-table if inside FormElements
                          */
                        if ($element instanceof DisplayDatatablesAsync) {
                            if ($element->getName() == $name) {
                                return $this->renderFindedTable($element, $application, $request);
                            }
                        }

                        /*
                          * Try to find data table in columns
                          */
                        if ($element instanceof Column) {
                            foreach ($element->getElements() as $columnElement) {
                                if ($columnElement instanceof DisplayDatatablesAsync) {
                                    if ($columnElement->getName() == $name) {
                                        return $this->renderFindedTable($columnElement, $application, $request);
                                    }
                                }
                            }
                        }
                    }
                }

                /*
                  * Finded trully in content-tab
                  */
                if ($content instanceof DisplayDatatablesAsync) {
                    if ($content->getName() == $name) {
                        return $this->renderFindedTable($content, $application, $request);
                    }
                }
            }
        }

        if ($display instanceof DisplayDatatablesAsync) {
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
        $display = $model->fireDisplay($request->input('parameters') ?: []);

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
     * @param  DisplayDatatablesAsync  $datatable
     * @param  Application  $application
     * @param  Request  $request
     * @return array|JsonResponse
     */
    protected function renderFindedTable(DisplayDatatablesAsync $datatable, Application $application, Request $request)
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
