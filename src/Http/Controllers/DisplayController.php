<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Display\DisplayDatatablesAsync;
use SleepingOwl\Admin\Display\DisplayTabbed;
use SleepingOwl\Admin\Display\DisplayTree;

class DisplayController extends Controller
{
    /**
     * @param ModelConfigurationInterface $model
     * @param Request $request
     * @param Application $application
     * @param null $name
     *
     * @return JsonResponse
     */
    public function async(ModelConfigurationInterface $model, Request $request, Application $application, $name = null)
    {
        $display = $model->fireDisplay();

        if ($display instanceof DisplayTabbed) {
            $tabs = $display->getTabs();
            foreach ($tabs as $tab) {
                $content = $tab->getContent();
                if ($content instanceof DisplayDatatablesAsync && $content->getName() === $name) {
                    return $content;
                }
            }
        }

        if ($display instanceof DisplayDatatablesAsync) {
            try {
                return $display->renderAsync($request);
            } catch (\Exception $exception) {
                return new JsonResponse([
                    'message'  => $application->isLocal()
                        ? $exception->getMessage()
                        : trans('sleeping_owl::lang.table.error'),
                ], 403);
            }
        }

        abort(404);
    }

    /**
     * @param ModelConfigurationInterface $model
     * @param Request $request
     */
    public function treeReorder(ModelConfigurationInterface $model, Request $request)
    {
        $display = $model->fireDisplay();

        if ($display instanceof DisplayTabbed) {
            $display->getTabs()->each(function ($tab) use($request) {
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
}