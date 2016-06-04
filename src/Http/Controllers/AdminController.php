<?php

namespace SleepingOwl\Admin\Http\Controllers;

use AdminTemplate;
use App;
use Breadcrumbs;
use Request;
use Illuminate\Contracts\Support\Renderable;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use SleepingOwl\Admin\Contracts\Display\ColumnEditableInterface;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\DataProvider\Configuration;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Utils\Invoker;

class AdminController extends Controller
{
    /**
     * @var \SleepingOwl\Admin\Navigation
     */
    public $navigation;

    /**
     * @var
     */
    private $parentBreadcrumb = 'home';

    public function __construct()
    {
        $this->navigation = app('sleeping_owl.navigation');

        Breadcrumbs::register('home', function ($breadcrumbs) {
            $breadcrumbs->push('Dashboard', route('admin.dashboard'));
        });

        $breadcrumbs = [];

        if ($currentPage = $this->navigation->getCurrentPage()) {
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
            Breadcrumbs::register($breadcrumb['id'], function ($breadcrumbs) use ($breadcrumb) {
                $breadcrumbs->parent($breadcrumb['parent']);
                $breadcrumbs->push($breadcrumb['title'], $breadcrumb['url']);
            });
        }
    }

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

        $this->registerBreadcrumb($model->getCreateTitle(), $this->parentBreadcrumb);

        return $this->render($model, $create, $model->getCreateTitle());
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
        $nextAction = Request::input('next_action');

        $backUrl = $this->getBackUrl();

        if ($createForm instanceof FormInterface) {
            if (($validator = $createForm->validate($model)) instanceof Validator) {
                return redirect()->back()
                    ->withErrors($validator)
                    ->withInput()
                    ->with([
                        '_redirectBack' => $backUrl,
                    ]);
            }

            if ($model->fireEvent('creating') === false) {
                return redirect()->back()->with([
                    '_redirectBack' => $backUrl,
                ]);
            }

            $createForm->save($model);

            $model->fireEvent('created', false);
        }

        if ($nextAction == 'save_and_continue') {
            $newModel = $createForm->getModel();
            $primaryKey = $newModel->getKeyName();

            $response = redirect()->to(
                $model->getEditUrl($newModel->{$primaryKey})
            )->with([
                '_redirectBack' => $backUrl,
            ]);
        } elseif ($nextAction == 'save_and_create') {
            $response = redirect()->to($model->getCreateUrl())->with([
                '_redirectBack' => $backUrl,
            ]);
        } else {
            $response = redirect()->to(Request::input('_redirectBack', $model->getDisplayUrl()));
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

        $this->registerBreadcrumb($model->getEditTitle(), $this->parentBreadcrumb);

        return $this->render($model, $model->fireFullEdit($id), $model->getEditTitle());
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
        $nextAction = Request::input('next_action');

        $backUrl = $this->getBackUrl();

        if ($editForm instanceof FormInterface) {
            if (($validator = $editForm->validate($model)) instanceof Validator) {
                return redirect()->back()
                    ->withErrors($validator)
                    ->withInput();
            }

            if ($model->fireEvent('updating', true, $item) === false) {
                return redirect()->back()->with([
                    '_redirectBack' => $backUrl,
                ]);
            }

            $editForm->save($model);

            $model->fireEvent('updated', false, $item);
        }

        if ($nextAction == 'save_and_continue') {
            $response = redirect()->back()->with([
                '_redirectBack' => $backUrl,
            ]);
        } elseif ($nextAction == 'save_and_create') {
            $response = redirect()->to($model->getCreateUrl())->with([
                '_redirectBack' => $backUrl,
            ]);
        } else {
            $response = redirect()->to(Request::input('_redirectBack', $model->getDisplayUrl()));
        }

        return $response->with('success_message', $model->getMessageOnUpdate());
    }

    /**
     * @param ModelConfiguration $model
     *
     * @return bool
     */
    public function inlineEdit(ModelConfiguration $model)
    {
        $field = Request::input('name');
        $value = Request::input('value');
        $id = Request::input('pk');

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

        if ($model->fireEvent('deleting', true, $item) === false) {
            return redirect()->back();
        }

        $model->getRepository()->delete($id);

        $model->fireEvent('deleted', false, $item);

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

        return redirect()->back()->with('success_message', $model->getMessageOnRestore());
    }

    /**
     * @param ModelConfiguration $model
     * @param Renderable|string $content
     * @param string|null $title
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function render(ModelConfiguration $model, $content, $title = null)
    {
        if ($content instanceof Renderable) {
            $content = $content->render();
        }

        if (is_null($title)) {
            $title = $model->getTitle();
        }

        return AdminTemplate::view('_layout.inner')
            ->with('title', $title)
            ->with('content', $content)
            ->with('breadcrumbKey', $this->parentBreadcrumb)
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
            ->with('breadcrumbKey', $this->parentBreadcrumb)
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
            'locale'     => App::getLocale(),
            'token'      => csrf_token(),
            'url_prefix' => config('sleeping_owl.url_prefix'),
            'lang'       => $lang,
            'wysiwyg'    => config('sleeping_owl.wysiwyg'),
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

    /**
     * @return string|null
     */
    protected function getBackUrl()
    {
        if (($backUrl = Request::input('_redirectBack')) == url()->previous()) {
            $backUrl = null;
            Request::merge(['_redirectBack' => $backUrl]);
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
        Breadcrumbs::register('render', function ($breadcrumbs) use ($title, $parent) {
            $breadcrumbs->parent($parent);
            $breadcrumbs->push($title);
        });

        $this->parentBreadcrumb = 'render';
    }

    /**
     * @param string $title
     * @param string $parent
     */
    public function dataProvider(ModelConfiguration $model, Request $request)
    {
        $dp = app('sleeping_owl.data_provider');
        $cls = $model->getClass();

        // check if has dataProvider to Model
        /** @var Configuration $cfg */
        if (is_null($cfg = $dp->get($cls))) {
            abort(404);
        }

        // check if model is displayable
        if (! $model->isDisplayable()) {
            abort(403);
        }

        // create a query
        $query = $model->getRepository()->getQuery();

        // the default invoker params instance resolver
        $pmap = [
            ModelConfiguration::class => $model,
            Configuration::class => $cfg,
            Request::class => $request,
        ];

        // the invoker
        $invoke = function &($handler, $args) use (&$pmap) {
            return Invoker::create($handler, $args)
                ->setDependencyProviderByRef($pmap)->invoke();
        };

        // aplly the query handler if has be set
        if (! is_null($handler = $cfg->getQueryHandler())) {
            $query = $invoke($handler, [$query]);
        }

        // the response info
        $info = [];

        $id = Request::input('id');

        if (! is_null($id)) {
            if (strlen($id) == 0) {
                abort(400, 'ID param is empty.');
            }

            $id = explode(',', $id);

            if (count($id) == 1) {
                $data = $query->find($id[0]);
                $data = is_null($data) ? [] : [$data];
            } else {
                $data = $query->findMany($id)->all();
            }

            if ($cfg->isAll()) {
                if ($cfg->isRecordsCount()) {
                    $info['total'] = count($data);
                }
            } else {
                $info = array_merge($info, [
                    'total' => count($data),
                    'per_page' => $cfg->perPage(),
                    'current_page' => 1,
                    'last_page' => 1,
                    'next_page_url' => null,
                    'prev_page_url' => null,
                    'from' => 1,
                    'to' => count($data),
                ]);
            }
        } else {
            // if count records
            if ($cfg->isTotalize()) {
                $info['totalCount'] = $query->count();
            }

            // apply all filters
            foreach ($cfg->getFilters() as $handler) {
                $query = $invoke($handler, [$query]);
            }

            // if searchable by TERM, apply it
            if ($cfg->isSearchable()
                && ! is_null($handler = $cfg->getSearchHandler())
                && ! empty($q = Request::input($cfg->getSearchParam(), ''))
            ) {
                $query = $invoke($handler, [$query, &$q]);
            }

            // all records, without pagination
            if ($cfg->isAll()) {
                if ($cfg->isRecordsCount()) {
                    $info['total'] = $query->count();
                }
                $data = $query->get()->all();
            } else {
                $results = $query->paginate($cfg->perPage());
                $info = array_merge($info, [
                    'total' => $results->total(),
                    'per_page' => $results->perPage(),
                    'current_page' => $results->currentPage(),
                    'last_page' => $results->lastPage(),
                    'next_page_url' => $results->nextPageUrl(),
                    'prev_page_url' => $results->previousPageUrl(),
                    'from' => $results->firstItem(),
                    'to' => $results->lastItem(),
                ]);
                $data = $results->items();
                unset($results);
            }
        }

        array_walk($data, function (Model $e) use ($cfg) {
            $e->addHidden($cfg->getHidden());
            $e->fillable(array_merge($cfg->getFillable()));
        });

        if (! empty($formatterName = Request::input('_dp_format', ''))) {
            if (! is_null($formatter = $cfg->getItemFormatter($formatterName))) {
                array_walk($data, function (&$e) use ($formatter, $invoke) {
                    return $invoke($formatter, [&$e]);
                });
            } else {
                abort(400, "Unknow format '$formatterName'.");
            }
        }

        if (! empty($formatterName = Request::input('_dp_responseFormat', ''))) {
            if (is_null($formatter = $cfg->getResponseFormatter($formatterName))) {
                abort(400, "Unknow response format '$formatterName'.");
            }
        } else {
            $formatter = function &(&$data, &$info) {
                $r = ['items' => &$data];

                if (! empty($info)) {
                    $r['info'] = &$info;
                }

                return $r;
            };
        }

        $result = $invoke($formatter, [&$data, &$info]);

        if (! is_null($handler = $cfg->getPostFormatHandler())) {
            $invoke($handler, [&$result, &$info]);
        }

        return response()->json($result);
    }
}
