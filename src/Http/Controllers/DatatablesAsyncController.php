<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Display\DisplayDatatablesAsync;
use SleepingOwl\Admin\Display\DisplayTabbed;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DatatablesAsyncController extends Controller
{
    /**
     * @param ModelConfigurationInterface $model
     * @param string $name
     * @return JsonResponse
     */
    public function data(ModelConfigurationInterface $model, $name = null)
    {
        if (! $model->isDisplayable()) {
            throw new NotFoundHttpException();
        }

        $display = $model->fireDisplay();

        if ($display instanceof DisplayTabbed) {
            $display = $this->findDatatablesAsyncByName($display, $name);
        }

        if ($display instanceof DisplayDatatablesAsync) {
            return new JsonResponse($display->renderAsync());
        }

        throw new NotFoundHttpException();
    }

    /**
     * @param DisplayTabbed $display
     * @param string $name
     * @return \Illuminate\Contracts\Support\Renderable|null
     */
    protected function findDatatablesAsyncByName(DisplayTabbed $display, $name)
    {
        $tabs = $display->getTabs();
        foreach ($tabs as $tab) {
            $content = $tab->getContent();
            if ($content instanceof self && $content->getName() === $name) {
                return $content;
            }
        }
    }
}
