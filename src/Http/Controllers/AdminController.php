<?php

namespace SleepingOwl\Admin\Http\Controllers;

use Diglactic\Breadcrumbs\Exceptions\DuplicateBreadcrumbException;
use Diglactic\Breadcrumbs\Generator as BreadcrumbsGenerator;
use Diglactic\Breadcrumbs\Manager as BreadcrumbsManager;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Form\FormInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Support\Display\InlineEditHandler;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AdminController extends Controller
{
    /**
     * @var BreadcrumbsManager
     */
    protected $breadcrumbs;

    /**
     * @var
     */
    protected $breadCrumbsData;

    /**
     * @var AdminInterface
     */
    protected $admin;

    /**
     * @var
     */
    private $parentBreadcrumb = 'home';

    protected InlineEditHandler $inlineEdits;

    /**
     * AdminController constructor.
     *
     * @param  Request  $request
     * @param  AdminInterface  $admin
     *
     * @throws DuplicateBreadcrumbException
     */
    public function __construct(
        Request $request,
        AdminInterface $admin,
        InlineEditHandler $inlineEdits
    ) {
        $this->admin = $admin;
        $this->breadcrumbs = $admin->template()->breadcrumbs();
        $this->inlineEdits = $inlineEdits;

        $admin->navigation()->setCurrentUrl($request->getUri());

        if (! $this->breadcrumbs->exists('home')) {
            $this->breadcrumbs->for('home', function (BreadcrumbsGenerator $breadcrumbs) {
                $breadcrumbs->push(trans('sleeping_owl::lang.dashboard'), route('admin.dashboard'));
            });
        }

        $this->breadCrumbsData = [];

        if ($currentPage = $admin->navigation()->getCurrentPage()) {
            foreach ($currentPage->getPathArray() as $page) {
                $this->breadCrumbsData[] = [
                    'id' => $page['id'],
                    'title' => $page['title'],
                    'url' => $page['url'],
                    'parent' => $this->parentBreadcrumb,
                ];

                $this->parentBreadcrumb = $page['id'];
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
     * @param  string  $parentBreadcrumb
     */
    public function setParentBreadcrumb($parentBreadcrumb)
    {
        $this->parentBreadcrumb = $parentBreadcrumb;
    }

    /**
     * @return Factory|View
     */
    public function getDashboard()
    {
        return $this->renderContent(
            $this->admin->template()->view('dashboard'),
            trans('sleeping_owl::lang.dashboard')
        );
    }

    /**
     * @param  ModelConfigurationInterface  $model
     * @return Factory|View
     *
     * @throws DuplicateBreadcrumbException
     */
    public function getDisplay(ModelConfigurationInterface $model)
    {
        if (! $model->isDisplayable()) {
            abort(404);
        }

        $display = $model->fireDisplay();

        $this->registerBreadcrumbs($model);

        return $this->render($model, $display);
    }

    /**
     * @param  ModelConfigurationInterface  $model
     * @return Factory|View
     *
     * @throws DuplicateBreadcrumbException
     */
    public function getCreate(ModelConfigurationInterface $model)
    {
        if (! $model->isCreatable()) {
            abort(404);
        }

        $create = $model->fireCreate();

        $this->registerBreadcrumbs($model);
        $this->registerBreadcrumb($model->getCreateTitle(), $this->parentBreadcrumb);

        return $this->render($model, $create, $model->getCreateTitle());
    }

    /**
     * @param  ModelConfigurationInterface  $model
     * @param  Request  $request
     * @return RedirectResponse
     */
    public function postStore(ModelConfigurationInterface $model, Request $request)
    {
        if (! $model->isCreatable()) {
            abort(404);
        }

        $createForm = $model->fireCreate();
        $nextAction = $request->input('next_action');

        $backUrl = $this->getBackUrl($request);

        if ($createForm instanceof FormInterface) {
            try {
                $createForm->validateForm($request, $model);

                if ($createForm->saveForm($request, $model) === false) {
                    return redirect()->back()->with([
                        '_redirectBack' => $backUrl,
                        'sleeping_owl_tab_id' => $request->get('sleeping_owl_tab_id') ?: null,
                    ]);
                }
            } catch (ValidationException $exception) {
                return redirect()->back()
                    ->withErrors($exception->validator)
                    ->withInput()
                    ->with([
                        '_redirectBack' => $backUrl,
                        'sleeping_owl_tab_id' => $request->get('sleeping_owl_tab_id') ?: null,
                    ]);
            }
        }

        if ($nextAction == 'save_and_continue') {
            $newModel = $createForm->getModel();
            $primaryKey = $newModel->getKeyName();

            $redirectUrl = $model->getEditUrl($newModel->{$primaryKey});
            $redirectPolicy = $model->getRedirect();

            /*
             * @see Make redirect when use in model config && Fix editable redirect
             */
            if ($redirectPolicy->get('create') == 'display' || ! $model->isEditable($newModel)) {
                $redirectUrl = $model->getDisplayUrl();
            }

            $response = redirect()->to(
                $redirectUrl
            )->with([
                '_redirectBack' => $backUrl,
                'sleeping_owl_tab_id' => $request->get('sleeping_owl_tab_id') ?: null,
            ]);
        } elseif ($nextAction == 'save_and_create') {
            $response = redirect()->to($model->getCreateUrl($request->except([
                '_redirectBack',
                '_token',
                'url',
                'next_action',
            ])))->with([
                '_redirectBack' => $backUrl,
                'sleeping_owl_tab_id' => $request->get('sleeping_owl_tab_id') ?: null,
            ]);
        } else {
            $response = redirect()->to($request->input('_redirectBack', $model->getDisplayUrl()));
        }

        return $response->with('success_message', $model->getMessageOnCreate());
    }

    /**
     * @param  ModelConfigurationInterface  $model
     * @param  $id
     * @return Factory|View
     *
     * @throws DuplicateBreadcrumbException
     */
    public function getEdit(ModelConfigurationInterface $model, $id)
    {
        $item = $model->getRepository()->find($id);

        if (is_null($item) || ! $model->isEditable($item)) {
            abort(404);
        }

        if (method_exists($model, 'setModelValue')) {
            $model->setModelValue($item);
        }

        $edit = $model->fireEdit($id);

        $this->registerBreadcrumbs($model);
        $this->registerBreadcrumb($model->getEditTitle(), $this->parentBreadcrumb);

        return $this->render($model, $edit, $model->getEditTitle());
    }

    /**
     * @param  ModelConfigurationInterface  $model
     * @param  Request  $request
     * @param  int  $id
     * @return RedirectResponse
     *
     * @throws NotFoundHttpException
     */
    public function postUpdate(ModelConfigurationInterface $model, Request $request, $id)
    {
        /** @var FormInterface $editForm */
        $editForm = $model->fireEdit($id);
        $item = $editForm->getModel();

        if (is_null($item) || ! $model->isEditable($item)) {
            abort(404);
        }

        $nextAction = $request->input('next_action');

        $backUrl = $this->getBackUrl($request);

        if ($editForm instanceof FormInterface) {
            try {
                $editForm->validateForm($request, $model);

                if ($editForm->saveForm($request, $model) === false) {
                    return redirect()->back()->with([
                        '_redirectBack' => $backUrl,
                        'sleeping_owl_tab_id' => $request->get('sleeping_owl_tab_id') ?: null,
                    ]);
                }
            } catch (ValidationException $exception) {
                return redirect()->back()
                    ->withErrors($exception->validator)
                    ->withInput()
                    ->with([
                        '_redirectBack' => $backUrl,
                        'sleeping_owl_tab_id' => $request->get('sleeping_owl_tab_id') ?: null,
                    ]);
            }
        }

        $redirectPolicy = $model->getRedirect();

        if ($nextAction == 'save_and_continue') {
            $response = redirect()->back()->with([
                '_redirectBack' => $backUrl,
                'sleeping_owl_tab_id' => $request->get('sleeping_owl_tab_id') ?: null,
            ]);

            if ($redirectPolicy->get('edit') == 'display') {
                $response = redirect()->to(
                    $model->getDisplayUrl()
                )->with([
                    '_redirectBack' => $backUrl,
                    'sleeping_owl_tab_id' => $request->get('sleeping_owl_tab_id') ?: null,
                ]);
            }
        } elseif ($nextAction == 'save_and_create') {
            $response = redirect()->to($model->getCreateUrl($request->except([
                '_redirectBack',
                '_token',
                'url',
                'next_action',
            ])))->with([
                '_redirectBack' => $backUrl,
                'sleeping_owl_tab_id' => $request->get('sleeping_owl_tab_id') ?: null,
            ]);
        } else {
            $response = redirect()->to($request->input('_redirectBack', $model->getDisplayUrl()));
        }

        return $response->with('success_message', $model->getMessageOnUpdate());
    }

    /**
     * @param  ModelConfigurationInterface  $model
     * @param  Request  $request
     * @return JsonResponse
     */
    public function inlineEdit(ModelConfigurationInterface $model, Request $request)
    {
        return response()->json($this->inlineEdits->handle($model, $request));
    }

    /**
     * @param  ModelConfigurationInterface  $model
     * @param  Request  $request
     * @param  int  $id
     * @return RedirectResponse
     */
    public function deleteDelete(ModelConfigurationInterface $model, Request $request, $id)
    {
        $item = $model->getRepository()->find($id);

        if (is_null($item) || ! $model->isDeletable($item)) {
            abort(404);
        }

        $model->fireDelete($id);

        if ($model->fireEvent('deleting', true, $item, $request) === false) {
            return redirect()->back();
        }

        $model->getRepository()->delete($id);

        $model->fireEvent('deleted', false, $item, $request);

        return redirect($request->input('_redirectBack', back()->getTargetUrl()))
            ->with('success_message', $model->getMessageOnDelete());
    }

    /**
     * @param  ModelConfigurationInterface  $model
     * @param  Request  $request
     * @param  int  $id
     * @return RedirectResponse
     *
     * @throws NotFoundHttpException
     */
    public function deleteDestroy(ModelConfigurationInterface $model, Request $request, $id)
    {
        if (! $model->isRestorableModel()) {
            abort(404);
        }

        $item = $model->getRepository()->findOnlyTrashed($id);

        if (is_null($item) || ! $model->isRestorable($item)) {
            abort(404);
        }

        $model->fireDestroy($id);

        if ($model->fireEvent('destroying', true, $item, $request) === false) {
            return redirect()->back();
        }

        $model->getRepository()->forceDelete($id);

        $model->fireEvent('destroyed', false, $item, $request);

        return redirect($request->input('_redirectBack', back()->getTargetUrl()))
            ->with('success_message', $model->getMessageOnDestroy());
    }

    /**
     * @param  ModelConfigurationInterface|ModelConfiguration  $model
     * @param  Request  $request
     * @param  int  $id
     * @return RedirectResponse
     *
     * @throws NotFoundHttpException
     */
    public function postRestore(ModelConfigurationInterface $model, Request $request, $id)
    {
        if (! $model->isRestorableModel()) {
            abort(404);
        }

        $item = $model->getRepository()->findOnlyTrashed($id);

        if (is_null($item) || ! $model->isRestorable($item)) {
            abort(404);
        }

        $model->fireRestore($id);

        if ($model->fireEvent('restoring', true, $item, $request) === false) {
            return redirect()->back();
        }

        $model->getRepository()->restore($id);

        $model->fireEvent('restored', false, $item, $request);

        return redirect($request->input('_redirectBack', back()->getTargetUrl()))
            ->with('success_message', $model->getMessageOnRestore());
    }

    /**
     * @param  ModelConfigurationInterface  $model
     * @param  Renderable|RedirectResponse|string  $content
     * @param  string|null  $title
     * @return Factory|View|RedirectResponse
     */
    public function render(ModelConfigurationInterface $model, $content, $title = null)
    {
        if ($content instanceof RedirectResponse) {
            return $content;
        }

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
     * @param  Renderable|string  $content
     * @param  string|null  $title
     * @return Factory|View
     */
    public function renderContent($content, ?string $title = null)
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
     * @param  Request  $request
     * @return null|string
     */
    protected function getBackUrl(Request $request)
    {
        if (($backUrl = $request->input('_redirectBack')) == URL::previous()) {
            $backUrl = null;
            $request->merge(['_redirectBack' => $backUrl]);
        }

        return $backUrl;
    }

    public function getWildcard()
    {
        abort(404);
    }

    /**
     * @param  $title
     * @param  $parent
     * @param  string  $name
     * @param  $url
     *
     * @throws DuplicateBreadcrumbException
     */
    protected function registerBreadcrumb($title, $parent, string $name = 'render', $url = null)
    {
        $this->breadcrumbs->for($name, function (BreadcrumbsGenerator $breadcrumbs) use ($title, $parent, $url) {
            $breadcrumbs->parent($parent);
            $breadcrumbs->push($title, $url);
        });

        $this->parentBreadcrumb = $name;
    }

    /**
     * @param  ModelConfigurationInterface  $model
     *
     * @throws DuplicateBreadcrumbException
     */
    protected function registerBreadcrumbs(ModelConfigurationInterface $model)
    {
        $this->breadCrumbsData = array_merge($this->breadCrumbsData, $model->getBreadCrumbs());

        foreach ($this->breadCrumbsData as $breadcrumb) {
            if (! $this->breadcrumbs->exists($breadcrumb['id'])) {
                $this->breadcrumbs->for($breadcrumb['id'], function (BreadcrumbsGenerator $breadcrumbs) use ($breadcrumb) {
                    $breadcrumbs->parent($breadcrumb['parent']);
                    $breadcrumbs->push($breadcrumb['title'], $breadcrumb['url']);
                });
            }
        }

        //nit:Daan
        // $this->parentBreadcrumb = data_get(Arr::last($this->breadCrumbsData), 'id', 'render');
        $this->parentBreadcrumb = data_get(Arr::last($this->breadCrumbsData), 'id', $model->getClass());
    }

    /**
     * @param  ModelConfigurationInterface  $model
     * @param  Request  $request
     * @return JsonResponse|RedirectResponse
     */
    public function deletedAll(ModelConfigurationInterface $model, Request $request)
    {
        if (is_null($request->_id)) {
            return redirect()->back();
        }

        $items = $request->_id;

        foreach ($items as $id) {
            $item = $model->getRepository()->find($id);

            if (! $item) {
                return response()->Json(['error' => 'Haven`t row']);
            }

            if (isset($item->deleted_at) && $item->deleted_at) {
                $model->getRepository()->forceDelete($id);
            } else {
                $model->getRepository()->delete($id);
            }
        }

        $response = redirect()
            ->to($request
            ->input('_redirectBack', $model->getDisplayUrl()));

        return $response
            ->with('success_message', $model->getMessageOnDelete());
    }
}
