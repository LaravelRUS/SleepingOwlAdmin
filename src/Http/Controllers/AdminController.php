<?php

namespace SleepingOwl\Admin\Http\Controllers;

use AdminTemplate;
use App;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Request;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Model\ModelConfiguration;

class AdminController extends Controller
{
    /**
     * @param ModelConfiguration $model
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getDisplay(ModelConfiguration $model)
    {
        if (! $model->isDisplayable()) {
            abort(404);
        }

        return $this->render($model, $model->fireDisplay());
    }

    /**
     * @param ModelConfiguration $model
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getCreate(ModelConfiguration $model)
    {
        if (! $model->isCreatable()) {
            abort(404);
        }

        $create = $model->fireCreate();
        return $this->render($model, $create);
    }

    /**
     * @param ModelConfiguration $model
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postStore(ModelConfiguration $model)
    {
        if (! $model->isCreatable()) {
            abort(404);
        }

        $createForm = $model->fireCreate();
        $nextAction = Request::get('next_action');

        if ($createForm instanceof FormInterface) {
            if ($validator = $createForm->validate($model)) {
                return redirect()->back()->withErrors($validator)->withInput();
            }

            $createForm->save($model);
        }

        if ($nextAction == 'save_and_continue') {
            return redirect()->to($model->getEditUrl($createForm->getModel()->id));
        } else if ($nextAction == 'save_and_create') {
            return redirect()->to($model->getCreateUrl());
        }

        return redirect()->to($model->getDisplayUrl());
    }

    /**
     * @param ModelConfiguration $model
     * @param int                $id
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getEdit(ModelConfiguration $model, $id)
    {
        $item = $model->getRepository()->find($id);

        if (is_null($item) || ! $model->isEditable($item)) {
            abort(404);
        }

        return $this->render($model, $model->fireFullEdit($id));
    }

    /**
     * @param ModelConfiguration $model
     * @param int                $id
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postUpdate(ModelConfiguration $model, $id)
    {
        $item = $model->getRepository()->find($id);

        if (is_null($item) || ! $model->isEditable($item)) {
            abort(404);
        }

        $editForm = $model->fireFullEdit($id);
        $nextAction = Request::get('next_action');

        if ($editForm instanceof FormInterface) {
            if ($validator = $editForm->validate($model)) {
                return redirect()->back()->withErrors($validator)->withInput();
            }

            $editForm->save($model);
        }

        if ($nextAction == 'save_and_continue') {
            return redirect()->back();
        } else if ($nextAction == 'save_and_create') {
            return redirect()->to($model->getCreateUrl());
        }

        return redirect()->to($model->getDisplayUrl());
    }

    /**
     * @param ModelConfiguration $model
     * @param int                $id
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function deleteDestroy(ModelConfiguration $model, $id)
    {
        $item = $model->getRepository()->find($id);

        if (is_null($item) || ! $model->isDeletable($item)) {
            abort(404);
        }

        $model->fireDelete($id);
        $model->getRepository()->delete($id);

        return redirect()->back();
    }

    /**
     * @param ModelConfiguration $model
     * @param int                $id
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postRestore($model, $id)
    {
        $item = $model->getRepository()->find($id);

        if (is_null($item) || ! $model->isRestorable($item)) {
            abort(404);
        }

        $model->fireRestore($id);
        $model->getRepository()->restore($id);

        return redirect()->back();
    }

    /**
     * @param ModelConfiguration $model
     * @param Renderable|string  $content
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function render(ModelConfiguration $model, $content)
    {
        if ($content instanceof Renderable) {
            $content = $content->render();
        }

        return AdminTemplate::view('_layout.inner')
            ->with('title', $model->getTitle())
            ->with('content', $content);
    }

    /**
     * @param Renderable|string $content
     * @param string|null       $title
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function renderContent($content, $title = null)
    {
        if ($content instanceof Renderable) {
            $content = $content->render();
        }

        return AdminTemplate::view('_layout.inner')
            ->with('title', $title)
            ->with('content', $content);
    }

    /**
     * @return Response
     */
    public function getLang()
    {
        $lang = trans('sleeping_owl::lang');
        if ($lang == 'sleeping_owl::lang') {
            $lang = trans('sleeping_owl::lang', [], 'messages', 'en');
        }

        $data = [
            'locale'       => App::getLocale(),
            'token'        => csrf_token(),
            'prefix'       => config('sleeping_owl.prefix'),
            'lang'         => $lang,
            'ckeditor_cfg' => config('sleeping_owl.ckeditor'),
        ];

        $content = 'window.admin = '.json_encode($data).';';

        $response = new Response($content, 200, [
            'Content-Type' => 'text/javascript',
        ]);

        return $this->cacheResponse($response);
    }

    /**
     * @param Response $response
     *
     * @return Response
     */
    protected function cacheResponse(Response $response)
    {
        $response->setSharedMaxAge(31536000);
        $response->setMaxAge(31536000);
        $response->setExpires(new \DateTime('+1 year'));

        return $response;
    }

    public function getWildcard()
    {
        abort(404);
    }
}
