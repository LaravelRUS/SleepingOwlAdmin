<?php

namespace SleepingOwl\Admin\Http\Controllers;

use DaveJamesMiller\Breadcrumbs\BreadcrumbsGenerator;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Contracts\Form\FormInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Display\DisplayTabbed;
use SleepingOwl\Admin\Display\DisplayTable;
use SleepingOwl\Admin\Form\Columns\Column;
use SleepingOwl\Admin\Form\FormElements;
use SleepingOwl\Admin\Model\ModelConfiguration;

class AdminController extends Controller
{
    /**
     * @var \DaveJamesMiller\Breadcrumbs\BreadcrumbsManager
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

    /**
     * @var Application
     */
    public $app;

    /**
     * @var
     */
    protected $envPolicy;

    /**
     * AdminController constructor.
     *
     * @param  Request  $request
     * @param  AdminInterface  $admin
     * @param  Application  $application
     *
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\DuplicateBreadcrumbException
     */
    public function __construct(Request $request, AdminInterface $admin, Application $application)
    {
        $this->app = $application;
        $this->admin = $admin;
        $this->breadcrumbs = $admin->template()->breadcrumbs();

        if ($this->envPolicy = config('sleeping_owl.env_editor_policy')) {
            $this->envPolicy = new $this->envPolicy;
        }

        $admin->navigation()->setCurrentUrl($request->getUri());

        if (! $this->breadcrumbs->exists('home')) {
            $this->breadcrumbs->register('home', function (BreadcrumbsGenerator $breadcrumbs) {
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
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getDashboard()
    {
        return $this->renderContent(
            $this->admin->template()->view('dashboard'),
            trans('sleeping_owl::lang.dashboard')
        );
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function getEnvEditor()
    {
        $envFile = app()->environmentFilePath();
        $envContent = collect(parse_ini_file($envFile, false, INI_SCANNER_RAW));

        /**
         * Use filter masks.
         *
         * @param $key
         * @return bool
         */
        $envContent = $envContent->filter(function ($value, $key) {
            return ! in_array($key, config('sleeping_owl.env_editor_excluded_keys')) && ! $this->filterKey($key);
        });

        $envContent = $envContent->filter(function ($value, $key) {
            return $this->validatePolicy('display', $key);
        });

        $envContent = $envContent->map(function ($value, $key) {
            return (object) [
                'value' => $value,
                'editable' => $this->validatePolicy('edit', $key),
                'deletable' => $this->validatePolicy('delete', $key),
            ];
        });

        return $this->renderContent(
            $this->admin->template()->view('env_editor', ['data' => $envContent]),
            trans('sleeping_owl::lang.env_editor.title')
        );
    }

    /**
     * @param $permission
     * @param $key
     * @return bool
     */
    protected function validatePolicy($permission, $key)
    {
        return ($this->envPolicy && ((method_exists($this->envPolicy, $permission)
                    && $this->envPolicy->$permission(\Auth::user(), $key) !== false)))
            || ! method_exists($this->envPolicy, $permission) || ! $this->envPolicy || $this->validateBeforePolicy($key);
    }

    /**
     * @param $key
     * @return bool
     */
    protected function validateBeforePolicy($key)
    {
        return ($this->envPolicy && (method_exists($this->envPolicy, 'before'))
                && $this->envPolicy->before(\Auth::user(), $key) == true)
            || ! method_exists($this->envPolicy, 'before') || ! $this->envPolicy;
    }

    /**
     * @param  Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postEnvEditor(Request $request)
    {
        $envFile = app()->environmentFilePath();
        $envContent = collect(parse_ini_file($envFile, false, INI_SCANNER_RAW));

        $requestContent = collect($request->input('variables'));
        $removeContent = collect();

        foreach ($envContent as $key => $value) {
            if (! in_array($key, config('sleeping_owl.env_editor_excluded_keys')) && ! $this->filterKey($key)) {
                if ($requestContent->has($key)) {
                    if ($this->validatePolicy('edit', $key)) {
                        $envContent[$key] = $requestContent[$key]['value'];
                    }
                    $requestContent->forget($key);
                } else {
                    $envContent->forget($key);
                    $removeContent->put($key, null);
                }
            }
        }

        foreach ($requestContent as $key => $value) {
            if (! in_array($key, config('sleeping_owl.env_editor_excluded_keys')) && ! $this->filterKey($key)
                && $this->validatePolicy('create', $key)) {
                $this->writeEnvData($key, $value['value'], 1);
            }
            $requestContent->forget($key);
        }

        foreach ($removeContent as $key => $value) {
            if ($this->validatePolicy('delete', $key)) {
                $this->writeEnvData($key);
            }
        }

        foreach ($envContent as $key => $value) {
            $this->writeEnvData($key, $value);
        }

        return redirect()->back()->with('success_message', trans('sleeping_owl::lang.message.updated'));
    }

    /**
     * @param $key
     * @return bool
     */
    public function filterKey($key)
    {
        foreach (config('sleeping_owl.env_editor_excluded_keys') as $val) {
            if (strpos($val, '*') !== false) {
                $val = str_replace('*', '', $val);
                if (strpos($key, $val) !== false) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * @param $key
     * @param  null  $data
     * @param  bool  $new
     * @return bool
     */
    public function writeEnvData($key, $data = null, $new = null)
    {
        $envFile = app()->environmentFilePath();
        $str = file_get_contents($envFile);
        //nit: daan issue#1188
        if (is_null($data)) {
            $str = preg_replace("/$key=.*/m", "$key=", $str);
            file_put_contents($envFile, $str);

            return false;
        }

        if (is_null($new)) {
            $str = preg_replace("/$key=.*/m", "$key=$data", $str);
            file_put_contents($envFile, $str);

            return false;
        }

        $str = $str."\r\n$key=$data";
        file_put_contents($envFile, $str);

        return true;
    }

    /**
     * @param  ModelConfigurationInterface  $model
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     *
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\DuplicateBreadcrumbException
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
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     *
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\DuplicateBreadcrumbException
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
     * @return \Illuminate\Http\RedirectResponse
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
     * @param $id
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     *
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\DuplicateBreadcrumbException
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
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function inlineEdit(ModelConfigurationInterface $model, Request $request)
    {
        $field = $request->input('name');
        $id = $request->input('pk');
        $display = $model->fireDisplay();
        $column = null;

        /**
         * @var ColumnEditableInterface|null $column
         */
        if (is_callable([$display, 'getColumns'])) {
            $column = $display->getColumns()->all()->filter(function ($column) use ($field) {
                return ($column instanceof ColumnEditableInterface)
                    && ($column instanceof \SleepingOwl\Admin\Display\Column\NamedColumn)
                    && $field == $column->getName();
            })->first();
        } else {
            if ($display instanceof DisplayTabbed) {
                foreach ($display->getTabs() as $tab) {
                    $content = $tab->getContent();

                    if ($content instanceof DisplayTable) {
                        $column = $content->getColumns()->all()->filter(function ($column) use ($field) {
                            return ($column instanceof ColumnEditableInterface)
                                && ($column instanceof \SleepingOwl\Admin\Display\Column\NamedColumn)
                                && $field == $column->getName();
                        })->first();
                    }

                    if ($content instanceof FormElements) {
                        foreach ($content->getElements() as $element) {
                            /*
                             * Return data-table if inside FormElements
                             */
                            if ($element instanceof DisplayTable) {
                                $column = $element->getColumns()->all()->filter(function ($column) use ($field) {
                                    return ($column instanceof ColumnEditableInterface)
                                        && ($column instanceof \SleepingOwl\Admin\Display\Column\NamedColumn)
                                        && $field == $column->getName();
                                })->first();
                            }

                            /*
                             * Try to find inline Editable in columns
                             */
                            if ($element instanceof Column) {
                                foreach ($element->getElements() as $columnElement) {
                                    if ($columnElement instanceof DisplayTable) {
                                        $column = $columnElement->getColumns()->all()->filter(function ($column) use (
                                            $field
                                        ) {
                                            return ($column instanceof ColumnEditableInterface)
                                                && ($column instanceof \SleepingOwl\Admin\Display\Column\NamedColumn)
                                                && $field == $column->getName();
                                        })->first();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if (is_null($column)) {
            abort(404);
        }

        $repository = $model->getRepository();
        $item = $repository->find($id);

        if (is_null($item) || ! $model->isEditable($item)) {
            abort(404);
        }

        $column->setModel($item);

        if ($model->fireEvent('updating', true, $item, $request) === false) {
            return response()->json([
                'status' => false,
                'reason' => 'Can not fire event: updating',
            ]);
        }

        $newValue = $column->save($request);

        $model->fireEvent('updated', false, $item, $request);

        return response()->json([
            'status'   => true,
            'name'     => $field,
            'newValue' => $newValue !== null ? $newValue : $repository->find($id)->{$field},
            'pk'       => $id,
        ]);
    }

    /**
     * @param  ModelConfigurationInterface  $model
     * @param  Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
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
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
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
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
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
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View|\Illuminate\Http\RedirectResponse
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
     * @param  Request  $request
     * @return null|string
     */
    protected function getBackUrl(Request $request)
    {
        if (($backUrl = $request->input('_redirectBack')) == \URL::previous()) {
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
     * @param $title
     * @param $parent
     * @param $name
     * @param $url
     *
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\DuplicateBreadcrumbException
     */
    protected function registerBreadcrumb($title, $parent, $name = 'render', $url = null)
    {
        $this->breadcrumbs->register($name, function (BreadcrumbsGenerator $breadcrumbs) use ($title, $parent, $url) {
            $breadcrumbs->parent($parent);
            $breadcrumbs->push($title, $url);
        });

        $this->parentBreadcrumb = $name;
    }

    /**
     * @param  ModelConfigurationInterface  $model
     *
     * @throws \DaveJamesMiller\Breadcrumbs\Exceptions\DuplicateBreadcrumbException
     */
    protected function registerBreadcrumbs(ModelConfigurationInterface $model)
    {
        $this->breadCrumbsData = array_merge($this->breadCrumbsData, $model->getBreadCrumbs());

        foreach ($this->breadCrumbsData as $breadcrumb) {
            if (! $this->breadcrumbs->exists($breadcrumb['id'])) {
                $this->breadcrumbs->register($breadcrumb['id'], function (BreadcrumbsGenerator $breadcrumbs) use ($breadcrumb) {
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
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
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
