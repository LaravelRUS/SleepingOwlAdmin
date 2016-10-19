<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\Support\Collection;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\ActionInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayExtensionInterface;
use SleepingOwl\Admin\Contracts\Display\Placable;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\FilterInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Display\Extension\Actions;
use SleepingOwl\Admin\Display\Extension\Apply;
use SleepingOwl\Admin\Display\Extension\Filters;
use SleepingOwl\Admin\Display\Extension\Scopes;
use SleepingOwl\Admin\Traits\Assets;

/**
 * Class Display.
 *
 * @method Actions getActions()
 * @method $this setActions(ActionInterface $action, ...$actions)
 *
 * @method Filters getFilters()
 * @method $this setFilters(FilterInterface $filter, ...$filters)
 *
 * @method Apply getApply()
 * @method $this setApply(\Closure $apply, ...$applies)
 *
 * @method Scopes getScopes()
 * @method $this setScopes(array $scope, ...$scopes)
 */
abstract class Display implements DisplayInterface
{
    use HtmlAttributes, Assets;

    /**
     * @var string|\Illuminate\View\View
     */
    protected $view;

    /**
     * @var string
     */
    protected $modelClass;

    /**
     * @var array
     */
    protected $with = [];

    /**
     * @var string
     */
    protected $title;

    /**
     * @var string
     */
    protected $repositoryClass = RepositoryInterface::class;

    /**
     * @var RepositoryInterface
     */
    protected $repository;

    /**
     * @var DisplayExtensionInterface[]|Collection
     */
    protected $extensions;

    /**
     * @var bool
     */
    protected $initialized = false;

    /**
     * Display constructor.
     */
    public function __construct()
    {
        $this->extensions = new Collection();

        $this->extend('actions', new Actions());
        $this->extend('filters', new Filters());
        $this->extend('apply', new Apply());
        $this->extend('scopes', new Scopes());

        $this->initializePackage();
    }

    /**
     * @return bool
     */
    public function isInitialized()
    {
        return $this->initialized;
    }

    /**
     * @param string                    $name
     * @param DisplayExtensionInterface $extension
     *
     * @return DisplayExtensionInterface
     */
    public function extend($name, DisplayExtensionInterface $extension)
    {
        $this->extensions->put($name, $extension);

        $extension->setDisplay($this);

        return $extension;
    }

    /**
     * @return Collection|\SleepingOwl\Admin\Contracts\Display\DisplayExtensionInterface[]
     */
    public function getExtensions()
    {
        return $this->extensions;
    }

    /**
     * @return RepositoryInterface
     */
    public function getRepository()
    {
        return $this->repository;
    }

    /**
     * @param $repositoryClass
     *
     * @return $this
     */
    public function setRepositoryClass($repositoryClass)
    {
        $this->repositoryClass = $repositoryClass;

        return $this;
    }

    /**
     * @param array|string[] ...$relations
     *
     * @return $this
     */
    public function with($relations)
    {
        $this->with = array_flatten(func_get_args());

        return $this;
    }

    /**
     * @return void
     */
    public function initialize()
    {
        if ($this->isInitialized()) {
            return;
        }

        $this->repository = $this->makeRepository();
        $this->repository->with($this->with);

        $this->extensions->each(function (DisplayExtensionInterface $extension) {
            if ($extension instanceof Initializable) {
                $extension->initialize();
            }
        });

        $this->includePackage();

        $this->initialized = true;
    }

    /**
     * @param string $modelClass
     *
     * @return $this
     */
    public function setModelClass($modelClass)
    {
        if (is_null($this->modelClass)) {
            $this->modelClass = $modelClass;
        }

        return $this;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        $titles = [
            $this->title,
        ];

        $this->getExtensions()->each(function (DisplayExtensionInterface $extension) use (&$titles) {
            if (method_exists($extension, $method = 'getTitle')) {
                $titles[] = call_user_func([$extension, $method]);
            }
        });

        return implode(' | ', array_filter($titles));
    }

    /**
     * @param string $title
     *
     * @return $this
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'title' => $this->getTitle(),
            'extensions' => $this->getExtensions()->toArray(),
            'attributes' => $this->htmlAttributesToString(),
        ];
    }

    /**
     * @return string
     */
    public function getView()
    {
        return $this->view;
    }

    /**
     * @param string|\Illuminate\View\View $view
     *
     * @return $this
     */
    public function setView($view)
    {
        $this->view = $view;

        return $this;
    }

    /**
     * Get the evaluated contents of the object.
     *
     * @return string
     */
    public function render()
    {
        $view = app('sleeping_owl.template')->view($this->getView(), $this->toArray());

        $blocks = [];

        $placableExtensions = $this->getExtensions()->filter(function ($extension) {
            return $extension instanceof Placable;
        });

        foreach ($placableExtensions as $extension) {
            $blocks[$extension->getPlacement()][] = (string) app('sleeping_owl.template')->view(
                $extension->getView(),
                $extension->toArray()
            );
        }

        foreach ($blocks as $block => $data) {
            foreach ($data as $html) {
                if (! empty($html)) {
                    $view->getFactory()->startSection($block);
                    echo $html;
                    $view->getFactory()->yieldSection();
                }
            }
        }

        return $view;
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }

    /**
     * @param string $name
     * @param array  $arguments
     *
     * @return DisplayExtensionInterface
     */
    public function __call($name, $arguments)
    {
        $method = snake_case(substr($name, 3));

        if (starts_with($name, 'get') and $this->extensions->has($method)) {
            return $this->extensions->get($method);
        } elseif (starts_with($name, 'set') and $this->extensions->has($method)) {
            $extension = $this->extensions->get($method);

            if (method_exists($extension, 'set')) {
                return call_user_func_array([$extension, 'set'], $arguments);
            }
        }

        throw new \BadMethodCallException("Call to undefined method [{$name}]");
    }

    /**
     * @return ModelConfigurationInterface
     */
    protected function getModelConfiguration()
    {
        return app('sleeping_owl')->getModel($this->modelClass);
    }

    /**
     * @return \Illuminate\Foundation\Application|mixed
     * @throws \Exception
     */
    protected function makeRepository()
    {
        $repository = app($this->repositoryClass, [$this->modelClass]);

        if (! ($repository instanceof RepositoryInterface)) {
            throw new \Exception('Repository class must be instanced of [RepositoryInterface]');
        }

        return $repository;
    }
}
