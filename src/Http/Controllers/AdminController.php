<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Contracts\Validation\Factory;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Contracts\Validation\Validator;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Contracts\AdminInterface;
use Illuminate\Contracts\Foundation\Application;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;

class AdminController extends Controller
{
    /**
     * @var \DaveJamesMiller\Breadcrumbs\Manager
     */
    private $breadcrumbs;

    /**
     * @var
     */
    private $parentBreadcrumb = 'home';

    /**
     * @var \SleepingOwl\Admin\Admin
     */
    private $admin;

    /**
     * @var Request
     */
    private $request;

    /**
     * AdminController constructor.
     *
     * @param Request $request
     * @param AdminInterface $admin
     */
    public function __construct(Request $request, AdminInterface $admin)
    {
        $this->request = $request;
        $this->admin = $admin;
        $this->breadcrumbs = $admin->template()->breadcrumbs();

        $admin->navigation()->setCurrentUrl($request->url());

        if (! $this->breadcrumbs->exists('home')) {
            $this->breadcrumbs->register('home', function ($breadcrumbs) {
                $breadcrumbs->push(trans('sleeping_owl::lang.dashboard'), route('admin.dashboard'));
            });
        }

        $breadcrumbs = [];

        if ($currentPage = $admin->navigation()->getCurrentPage()) {
            foreach ($currentPage->getPathArray() as $page) {
                $breadcrumbs[] = [
                    'id' => $page['id'],
                    'title' => $page['title'],
                    'url' => $page['url'],
                    'parent' => $this->parentBreadcrumb,
                ];

                $this->parentBreadcrumb = $page['id'];
            }
        }

        foreach ($breadcrumbs as  $breadcrumb) {
            if (! $this->breadcrumbs->exists($breadcrumb['id'])) {
                $this->breadcrumbs->register($breadcrumb['id'], function ($breadcrumbs) use ($breadcrumb) {
                    $breadcrumbs->parent($breadcrumb['parent']);
                    $breadcrumbs->push($breadcrumb['title'], $breadcrumb['url']);
                });
            }
        }
    }

    /**
     * @return string
     */
    public function getParentBreadcrumb()
    {
        return $this->parentBreadcrumb;
    }

    /**
     * @param string $parentBreadcrumb
     */
    public function setParentBreadcrumb($parentBreadcrumb)
    {
        $this->parentBreadcrumb = $parentBreadcrumb;
    }

    /**
     * @param TemplateInterface $template
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getDashboard(TemplateInterface $template)
    {
        return $this->renderContent(
            $template->view('dashboard'),
            trans('sleeping_owl::lang.dashboard')
        );
    }

    /**
     * @param ModelConfigurationInterface $model
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getDisplay(ModelConfigurationInterface $model)
    {
        if (! $model->isDisplayable()) {
            abort(404);
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
            abort(404);
        }

        $create = $model->fireCreate();

        $this->registerBreadcrumb($model->getCreateTitle(), $this->parentBreadcrumb);

        return $this->render($model, $create, $model->getCreateTitle());
    }

    /**
     * @param ModelConfigurationInterface $model
     * @param Factory $factory
     * @param UrlGenerator $urlGenerator
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postStore(ModelConfigurationInterface $model,
                              Factory $factory,
                              UrlGenerator $urlGenerator
    ) {
        if (! $model->isCreatable()) {
            abort(404);
        }

        $createForm = $model->fireCreate();

        $nextAction = $this->request->input('next_action');

        $backUrl = $this->getBackUrl($urlGenerator);

        if ($createForm instanceof FormInterface) {
            if (($validator = $createForm->validateForm($model, $this->request, $factory)) instanceof Validator) {
                return redirect()->back()
                    ->withErrors($validator)
                    ->withInput()
                    ->with([
                        '_redirectBack' => $backUrl,
                    ]);
            }

            if ($createForm->saveForm($model, $this->request) === false) {
                return redirect()->back()->with([
                    '_redirectBack' => $backUrl,
                ]);
            }
        }

        if ($nextAction == 'save_and_continue') {
            $newModel = $createForm->getModel();
            $primaryKey = $newModel->getKeyName();

            $redirectUrl = $model->getEditUrl($newModel->{$primaryKey});
            $redirectPolicy = $model->getRedirect();

            /* Make redirect when use in model config && Fix editable redirect */
            if ($redirectPolicy->get('create') == 'display' || ! $model->isEditable($newModel)) {
                $redirectUrl = $model->getDisplayUrl();
            }

            $response = redirect()->to(
                $redirectUrl
            )->with([
                '_redirectBack' => $backUrl,
            ]);
        } elseif ($nextAction == 'save_and_create') {
            $response = redirect()->to($model->getCreateUrl($this->request->except([
                '_redirectBack',
                '_token',
                'url',
                'next_action',
            ])))->with([
                '_redirectBack' => $backUrl,
            ]);
        } else {
            $response = redirect()->to($this->request->input('_redirectBack', $model->getDisplayUrl()));
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
            abort(404);
        }

        $this->registerBreadcrumb($model->getEditTitle(), $this->parentBreadcrumb);

        return $this->render($model, $model->fireEdit($id), $model->getEditTitle());
    }

    /**
     * @param ModelConfigurationInterface $model
     * @param Factory $factory
     * @param UrlGenerator $urlGenerator
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postUpdate(ModelConfigurationInterface $model,
                               Factory $factory,
                               UrlGenerator $urlGenerator,
                               $id
    ) {
        /** @var FormInterface $editForm */
        $editForm = $model->fireEdit($id);
        $item = $editForm->getModel();

        if (is_null($item) || ! $model->isEditable($item)) {
            abort(404);
        }

        $nextAction = $this->request->input('next_action');

        $backUrl = $this->getBackUrl($urlGenerator);

        if ($editForm instanceof FormInterface) {
            if (($validator = $editForm->validateForm($model, $this->request, $factory)) instanceof Validator) {
                return redirect()->back()
                    ->withErrors($validator)
                    ->withInput();
            }

            if ($editForm->saveForm($model, $this->request) === false) {
                return redirect()->back()->with([
                    '_redirectBack' => $backUrl,
                ]);
            }
        }

        $redirectPolicy = $model->getRedirect();
        /* Make redirect when use in model config */

        if ($nextAction == 'save_and_continue') {
            $response = redirect()->back()->with([
                '_redirectBack' => $backUrl,
            ]);

            if ($redirectPolicy->get('edit') == 'display') {
                $response = redirect()->to(
                    $model->getDisplayUrl()
                )->with([
                    '_redirectBack' => $backUrl,
                ]);
            }
        } elseif ($nextAction == 'save_and_create') {
            $response = redirect()->to($model->getCreateUrl($this->request->except([
                '_redirectBack',
                '_token',
                'url',
                'next_action',
            ])))->with([
                '_redirectBack' => $backUrl,
            ]);
        } else {
            $response = redirect()->to($this->request->input('_redirectBack', $model->getDisplayUrl()));
        }

        return $response->with('success_message', $model->getMessageOnUpdate());
    }

    /**
     * @param ModelConfigurationInterface $model
     *
     * @return bool
     */
    public function inlineEdit(ModelConfigurationInterface $model)
    {
        $field = $this->request->input('name');
        $value = $this->request->input('value');
        $id = $this->request->input('pk');

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

        if ($model->fireEvent('updating', true, $item) === false) {
            return;
        }

        $column->save($value);

        $model->fireEvent('updated', false, $item);
    }

    /**
     * @param ModelConfigurationInterface $model
     * @param int                $id
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function deleteDelete(ModelConfigurationInterface $model, $id)
    {
        $item = $model->getRepository()->find($id);

        if (is_null($item) || ! $model->isDeletable($item)) {
            abort(404);
        }

        $model->fireDelete($id);

        if ($model->fireEvent('deleting', true, $item) === false) {
            return redirect()->back();
        }

        $model->getRepository()->delete($id);

        $model->fireEvent('deleted', false, $item);

        return redirect($this->request->input('_redirectBack', back()->getTargetUrl()))
            ->with('success_message', $model->getMessageOnDelete());
    }

    /**
     * @param ModelConfigurationInterface $model
     * @param int $id
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function deleteDestroy(ModelConfigurationInterface $model, $id)
    {
        if (! $model->isRestorableModel()) {
            abort(404);
        }

        $item = $model->getRepository()->findOnlyTrashed($id);

        if (is_null($item) || ! $model->isRestorable($item)) {
            abort(404);
        }

        $model->fireDestroy($id);

        if ($model->fireEvent('destroying', true, $item) === false) {
            return redirect()->back();
        }

        $model->getRepository()->forceDelete($id);

        $model->fireEvent('destroyed', false, $item);

        return redirect($this->request->input('_redirectBack', back()->getTargetUrl()))
            ->with('success_message', $model->getMessageOnDestroy());
    }

    /**
     * @param ModelConfigurationInterface $model
     * @param int                $id
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postRestore(ModelConfigurationInterface $model, $id)
    {
        if (! $model->isRestorableModel()) {
            abort(404);
        }

        $item = $model->getRepository()->findOnlyTrashed($id);

        if (is_null($item) || ! $model->isRestorable($item)) {
            abort(404);
        }

        $model->fireRestore($id);

        if ($model->fireEvent('restoring', true, $item) === false) {
            return redirect()->back();
        }

        $model->getRepository()->restore($id);

        $model->fireEvent('restored', false, $item);

        return redirect($this->request->input('_redirectBack', back()->getTargetUrl()))
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

        return $this->admin->template()->view('_layout.inner')
            ->with('title', $title)
            ->with('content', $content)
            ->with('breadcrumbKey', $this->parentBreadcrumb);
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

        return $this->admin->template()->view('_layout.inner')
            ->with('title', $title)
            ->with('content', $content)
            ->with('breadcrumbKey', $this->parentBreadcrumb);
    }

    /**
     * @param Application $application
     *
     * @return Response
     */
    public function getScripts(Application $application)
    {
        $lang = trans('sleeping_owl::lang');
        if ($lang == 'sleeping_owl::lang') {
            $lang = trans('sleeping_owl::lang', [], 'messages', 'en');
        }

        $data = [
            'locale' => $application->getLocale(),
            'url_prefix' => config('sleeping_owl.url_prefix'),
            'base_url' => asset('/'),
            'lang' => $lang,
            'wysiwyg' => config('sleeping_owl.wysiwyg'),
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
     * @param \Illuminate\Contracts\Routing\UrlGenerator|\Illuminate\Routing\UrlGenerator $urlGenerator
     *
     * @return null|string
     */
    protected function getBackUrl(UrlGenerator $urlGenerator)
    {
        if (($backUrl = $this->request->input('_redirectBack')) == $urlGenerator->previous()) {
            $backUrl = null;
            $this->request->merge(['_redirectBack' => $backUrl]);
        }

        return $backUrl;
    }

    public function getWildcard()
    {
        abort(404);
    }

    /**
     * @param string $title
     * @param string $parent
     */
    protected function registerBreadcrumb($title, $parent)
    {
        $this->breadcrumbs->register('render', function ($breadcrumbs) use ($title, $parent) {
            $breadcrumbs->parent($parent);
            $breadcrumbs->push($title);
        });

        $this->parentBreadcrumb = 'render';
    }
}
