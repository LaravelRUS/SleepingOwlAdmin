<?php

namespace SleepingOwl\Admin\Http\Controllers;

use App;
use Request;
use AdminTemplate;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Contracts\Validation\Validator;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;

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
            if (($validator = $createForm->validate($model)) instanceof Validator) {
                return redirect()->back()
                     ->withErrors($validator)
                     ->withInput();
            }

            $createForm->save($model);
        }

        if ($nextAction == 'save_and_continue') {
            $response = redirect()->to($model->getEditUrl($createForm->getModel()->id));
        } elseif ($nextAction == 'save_and_create') {
            $response = redirect()->to($model->getCreateUrl());
        } else {
            $response = redirect()->to($model->getDisplayUrl());
        }

        return $response->with('success_message', $model->getMessageOnCreate());
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
            if (($validator = $editForm->validate($model)) instanceof Validator) {
                return redirect()->back()
                    ->withErrors($validator)
                    ->withInput();
            }

            $editForm->save($model);
        }

        if ($nextAction == 'save_and_continue') {
            $response = redirect()->back();
        } elseif ($nextAction == 'save_and_create') {
            $response = redirect()->to($model->getCreateUrl());
        } else {
            $response = redirect()->to($model->getDisplayUrl());
        }

        return $response->with('success_message', $model->getMessageOnUpdate());
    }

    /**
     * @param ModelConfiguration $model
     */
    public function inlineEdit(ModelConfiguration $model)
    {
        $field = Request::get('name');
        $value = Request::get('value');
        $id = Request::get('pk');

        $display = $model->fireDisplay();

        /** @var ColumnEditableInterface|null $column */
        $column = $display->getColumns()->all()->filter(function ($column) use ($field) {
            return ($column instanceof ColumnEditableInterface) and $field == $column->getName();
        })->first();

        if (is_null($column)) {
            abort(404);
        }

        $repository = $model->getRepository();
        $item = $repository->find($id);

        if (is_null($item) || ! $model->isEditable($item)) {
            abort(404);
        }

        $column->setModel($item);
        $column->save($value);
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

        return redirect()->back()->with('success_message', $model->getMessageOnDelete());
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

        return redirect()->back()->with('success_message', $model->getMessageOnRestore());
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
            ->with('content', $content)
            ->with('successMessage', session('success_message'));
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
            ->with('content', $content)
            ->with('successMessage', session('success_message'));
    }

    /**
     * @return Response
     */
    public function getScripts()
    {
        $lang = trans('sleeping_owl::lang');
        if ($lang == 'sleeping_owl::lang') {
            $lang = trans('sleeping_owl::lang', [], 'messages', 'en');
        }

        $data = [
            'locale'       => App::getLocale(),
            'token'        => csrf_token(),
            'url_prefix'   => config('sleeping_owl.url_prefix'),
            'lang'         => $lang,
            'ckeditor_cfg' => config('sleeping_owl.ckeditor'),
        ];

        $content = "window.Admin['Settings'] = ".json_encode($data, JSON_PRETTY_PRINT).';';

        return $this->cacheResponse(
            new Response($content, 200, [
                'Content-Type' => 'text/javascript',
            ])
        );
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
