<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Routing\Redirector;
use SleepingOwl\Admin\Contracts\BreadcrumbsInterface;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\TemplateInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Translation\TranslatorInterface;

class AdminController extends Controller
{
    /**
     * @var BreadcrumbsInterface
     */
    protected $breadcrumbs;

    /**
     * @var TemplateInterface
     */
    protected $template;

    /**
     * @var TranslatorInterface
     */
    protected $translator;

    /**
     * @var UrlGenerator
     */
    protected $urlGenerator;

    /**
     * AdminController constructor.
     *
     * @param TemplateInterface $template
     * @param TranslatorInterface $translator
     * @param UrlGenerator $urlGenerator
     * @param BreadcrumbsInterface $breadcrumbs
     */
    public function __construct(TemplateInterface $template,
                                TranslatorInterface $translator,
                                UrlGenerator $urlGenerator,
                                BreadcrumbsInterface $breadcrumbs)
    {
        $this->template = $template;
        $this->translator = $translator;
        $this->urlGenerator = $urlGenerator;
        $this->breadcrumbs = $breadcrumbs;
    }

    /**
     * @param ModelConfigurationInterface $model
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getDisplay(ModelConfigurationInterface $model)
    {
        if (! $model->isDisplayable()) {
            throw new NotFoundHttpException();
        }

        return $this->render($model, $model->fireDisplay());
    }

    /**
     * @param ModelConfigurationInterface $model
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getCreate(ModelConfigurationInterface $model)
    {
        if (! $model->isCreatable()) {
            throw new NotFoundHttpException();
        }

        $create = $model->fireCreate();

        $this->breadcrumbs->register($model->getCreateTitle(), $this->breadcrumbs->getParentBreadcrumb());

        return $this->render($model, $create, $model->getCreateTitle());
    }

    /**
     * @param Request $request
     * @param Redirector $redirect
     * @param ModelConfigurationInterface $model
     * @return RedirectResponse
     */
    public function postStore(Request $request, Redirector $redirect, ModelConfigurationInterface $model)
    {
        if (! $model->isCreatable()) {
            throw new NotFoundHttpException();
        }

        $createForm = $model->fireCreate();
        $nextAction = $request->input('next_action');

        $backUrl = $this->getBackUrl($request);

        if ($createForm instanceof FormInterface) {
            if (($validator = $createForm->validateForm($model)) instanceof Validator) {
                return $redirect->back()
                    ->withErrors($validator)
                    ->withInput()
                    ->with([
                        '_redirectBack' => $backUrl,
                    ]);
            }

            if ($model->fireEvent('creating') === false) {
                return $redirect->back()->with([
                    '_redirectBack' => $backUrl,
                ]);
            }

            $createForm->saveForm($model);

            $model->fireEvent('created', false, $createForm->getModel());
        }

        if ($nextAction == 'save_and_continue') {
            $newModel = $createForm->getModel();
            $primaryKey = $newModel->getKeyName();

            $response = $redirect->to(
                $model->getEditUrl($newModel->{$primaryKey})
            )->with([
                '_redirectBack' => $backUrl,
            ]);
        } elseif ($nextAction == 'save_and_create') {
            $response = $redirect->to($model->getCreateUrl())->with([
                '_redirectBack' => $backUrl,
            ]);
        } else {
            $response = $redirect->to($request->input('_redirectBack', $model->getDisplayUrl()));
        }

        return $response->with('success_message', $model->getMessageOnCreate());
    }

    /**
     * @param ModelConfigurationInterface $model
     * @param int                $id
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getEdit(ModelConfigurationInterface $model, $id)
    {
        $item = $model->getRepository()->find($id);

        if (is_null($item) || ! $model->isEditable($item)) {
            throw new NotFoundHttpException();
        }

        $this->breadcrumbs->register($model->getEditTitle(), $this->breadcrumbs->getParentBreadcrumb());

        return $this->render($model, $model->fireEdit($id), $model->getEditTitle());
    }

    /**
     * @param Request $request
     * @param Redirector $redirect
     * @param ModelConfigurationInterface $model
     * @param int $id
     * @return RedirectResponse
     */
    public function postUpdate(Request $request, Redirector $redirect, ModelConfigurationInterface $model, $id)
    {
        $item = $model->getRepository()->find($id);

        if (is_null($item) || ! $model->isEditable($item)) {
            throw new NotFoundHttpException();
        }

        $editForm = $model->fireEdit($id);
        $nextAction = $request->input('next_action');

        $backUrl = $this->getBackUrl($request);

        if ($editForm instanceof FormInterface) {
            if (($validator = $editForm->validateForm($model)) instanceof Validator) {
                return redirect()->back()
                    ->withErrors($validator)
                    ->withInput();
            }

            if ($model->fireEvent('updating', true, $item) === false) {
                return $redirect->back()->with([
                    '_redirectBack' => $backUrl,
                ]);
            }

            $editForm->saveForm($model);

            $model->fireEvent('updated', false, $item);
        }

        if ($nextAction == 'save_and_continue') {
            $response = $redirect->back()->with([
                '_redirectBack' => $backUrl,
            ]);
        } elseif ($nextAction == 'save_and_create') {
            $response = $redirect->to($model->getCreateUrl())->with([
                '_redirectBack' => $backUrl,
            ]);
        } else {
            $response = $redirect->to($request->input('_redirectBack', $model->getDisplayUrl()));
        }

        return $response->with('success_message', $model->getMessageOnUpdate());
    }

    /**
     * @param Request $request
     * @param ModelConfigurationInterface $model
     * @return bool
     */
    public function inlineEdit(Request $request, ModelConfigurationInterface $model)
    {
        $field = $request->input('name');
        $value = $request->input('value');
        $id = $request->input('pk');

        $display = $model->fireDisplay();

        /** @var ColumnEditableInterface|null $column */
        $column = $display->getColumns()->all()->filter(function ($column) use ($field) {
            return ($column instanceof ColumnEditableInterface) and $field == $column->getName();
        })->first();

        if (is_null($column)) {
            throw new NotFoundHttpException();
        }

        $repository = $model->getRepository();
        $item = $repository->find($id);

        if (is_null($item) || ! $model->isEditable($item)) {
            throw new NotFoundHttpException();
        }

        $column->setModel($item);

        if ($model->fireEvent('updating', true, $item) === false) {
            return;
        }

        $column->save($value);

        $model->fireEvent('updated', false, $item);
    }

    /**
     * @param Request $request
     * @param Redirector $redirect
     * @param ModelConfigurationInterface $model
     * @param int $id
     * @return RedirectResponse
     */
    public function deleteDelete(Request $request, Redirector $redirect, ModelConfigurationInterface $model, $id)
    {
        $item = $model->getRepository()->find($id);

        if (is_null($item) || ! $model->isDeletable($item)) {
            throw new NotFoundHttpException();
        }

        $model->fireDelete($id);

        if ($model->fireEvent('deleting', true, $item) === false) {
            return $redirect->back();
        }

        $model->getRepository()->delete($id);

        $model->fireEvent('deleted', false, $item);

        return $redirect->to($request->input('_redirectBack', $redirect->back()->getTargetUrl()))
            ->with('success_message', $model->getMessageOnDelete());
    }

    /**
     * @param Request $request
     * @param Redirector $redirect
     * @param ModelConfigurationInterface $model
     * @param int $id
     * @return RedirectResponse
     */
    public function deleteDestroy(Request $request, Redirector $redirect, ModelConfigurationInterface $model, $id)
    {
        if (! $model->isRestorableModel()) {
            throw new NotFoundHttpException();
        }

        $item = $model->getRepository()->findOnlyTrashed($id);

        if (is_null($item) || ! $model->isRestorable($item)) {
            throw new NotFoundHttpException();
        }

        $model->fireDestroy($id);

        if ($model->fireEvent('destroying', true, $item) === false) {
            return $redirect->back();
        }

        $model->getRepository()->forceDelete($id);

        $model->fireEvent('destroyed', false, $item);

        return $redirect->to($request->input('_redirectBack', $redirect->back()->getTargetUrl()))
            ->with('success_message', $model->getMessageOnDestroy());
    }

    /**
     * @param Request $request
     * @param Redirector $redirect
     * @param ModelConfigurationInterface $model
     * @param int $id
     * @return RedirectResponse
     */
    public function postRestore(Request $request, Redirector $redirect, ModelConfigurationInterface $model, $id)
    {
        if (! $model->isRestorableModel()) {
            throw new NotFoundHttpException();
        }

        $item = $model->getRepository()->findOnlyTrashed($id);

        if (is_null($item) || ! $model->isRestorable($item)) {
            throw new NotFoundHttpException();
        }

        $model->fireRestore($id);

        if ($model->fireEvent('restoring', true, $item) === false) {
            return $redirect->back();
        }

        $model->getRepository()->restore($id);

        $model->fireEvent('restored', false, $item);

        return $redirect->to($request->input('_redirectBack', $redirect->back()->getTargetUrl()))
            ->with('success_message', $model->getMessageOnRestore());
    }

    /**
     * @param ModelConfigurationInterface $model
     * @param Renderable|string $content
     * @param string|null $title
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function render(ModelConfigurationInterface $model, $content, $title = null)
    {
        if ($content instanceof Renderable) {
            $content = $content->render();
        }

        if (is_null($title)) {
            $title = $model->getTitle();
        }

        return $this->template->view('_layout.inner')
            ->with('title', $title)
            ->with('content', $content)
            ->with('breadcrumbKey', $this->breadcrumbs->getParentBreadcrumb())
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

        return $this->template->view('_layout.inner')
            ->with('title', $title)
            ->with('content', $content)
            ->with('breadcrumbKey', $this->breadcrumbs->getParentBreadcrumb())
            ->with('successMessage', session('success_message'));
    }

    public function getScripts(Request $request, Repository $config)
    {
        $lang = $this->translator->trans('sleeping_owl::lang');
        if ($lang == 'sleeping_owl::lang') {
            $lang = $this->translator->trans('sleeping_owl::lang', [], 'messages', 'en');
        }

        $data = [
            'locale'     => $config->get('app.locale'),
            'token'      => $request->session()->get('_token'),
            'url_prefix' => $config->get('sleeping_owl.url_prefix'),
            'base_url' => asset('/'),
            'lang'       => $lang,
            'wysiwyg'    => $config->get('sleeping_owl.wysiwyg'),
        ];

        $content = 'window.Admin = {Settings: '.json_encode($data, JSON_PRETTY_PRINT).'}';

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

    /**
     * @param Request $request
     * @return null|string
     */
    protected function getBackUrl(Request $request)
    {
        if (($backUrl = $request->input('_redirectBack')) == $this->urlGenerator->previous()) {
            $backUrl = null;
            $request->merge(['_redirectBack' => $backUrl]);
        }

        return $backUrl;
    }

    public function getWildcard()
    {
        throw new NotFoundHttpException();
    }
}
