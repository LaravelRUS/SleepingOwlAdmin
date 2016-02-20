<?php

namespace SleepingOwl\Admin\Http\Controllers;

use App;
use Request;
use AdminTemplate;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Contracts\Support\Renderable;
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
        return $this->render($model, $model->fireDisplay());
    }

    /**
     * @param ModelConfiguration $model
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getCreate(ModelConfiguration $model)
    {
        $create = $model->fireCreate();
        if (is_null($create)) {
            abort(404);
        }

        return $this->render($model, $create);
    }

    /**
     * @param ModelConfiguration $model
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postStore(ModelConfiguration $model)
    {
        $createForm = $model->fireCreate();

        if (is_null($createForm)) {
            abort(404);
        }

        $nextAction = Request::get('next_action');

        if ($nextAction == 'cancel') {
            return redirect()->to($model->getDisplayUrl());
        }

        if ($createForm instanceof FormInterface) {
            if ($validator = $createForm->validate($model)) {
                return redirect()->back()->withErrors($validator)->withInput();
            }

            $createForm->save($model);
        }

        if ($nextAction == 'continue') {
            return redirect()->to($model->getEditUrl($createForm->getModelObject()->id));
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
        $edit = $model->fireFullEdit($id);
        if (is_null($edit)) {
            abort(404);
        }

        return $this->render($model, $edit);
    }

    /**
     * @param ModelConfiguration $model
     * @param int                $id
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postUpdate(ModelConfiguration $model, $id)
    {
        $editForm = $model->fireFullEdit($id);
        if (is_null($editForm)) {
            abort(404);
        }

        $nextAction = Request::get('next_action');

        if ($nextAction == 'cancel') {
            return redirect()->to($model->getDisplayUrl());
        }

        if ($editForm instanceof FormInterface) {
            if ($validator = $editForm->validate($model)) {
                return redirect()->back()->withErrors($validator)->withInput();
            }

            $editForm->save($model);
        }

        if ($nextAction == 'continue') {
            return redirect()->back();
        }

        return redirect()->to($model->getDisplayUrl());
    }

    /**
     * @param ModelConfiguration $model
     * @param int                $id
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postDestroy(ModelConfiguration $model, $id)
    {
        $delete = $model->fireDelete($id);

        if (is_null($delete)) {
            abort(404);
        }

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
        $restore = $model->fireRestore($id);
        if (is_null($restore)) {
            abort(404);
        }

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

        return view(AdminTemplate::view('_layout.inner'), [
            'title'   => $model->getTitle(),
            'content' => $content,
            'model'   => $model
        ]);
    }

    /**
     * @return Response
     */
    public function getLang()
    {
        $lang = trans('sleeping_owl::core');
        if ($lang == 'sleeping_owl::core') {
            $lang = trans('sleeping_owl::core', [], 'messages', 'en');
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
