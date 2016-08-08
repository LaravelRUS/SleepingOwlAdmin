<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Collection;
use KodiCMS\Assets\Package;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\ActionInterface;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Contracts\AssetsInterface;
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
use SleepingOwl\Admin\Factories\RepositoryFactory;
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
abstract class Display implements DisplayInterface, AssetsInterface
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
     * @var RepositoryFactory
     */
    protected $repositoryFactory;

    /**
     * @var DisplayExtensionInterface[]|Collection
     */
    protected $extensions;

    /**
     * @var bool
     */
    protected $initialized = false;

    /**
     * @var AdminInterface
     */
    protected $admin;

    /**
     * @var Factory
     */
    protected $viewFactory;

    /**
     * Display constructor.
     *
     * @param RepositoryFactory $repositoryFactory
     * @param AdminInterface $admin
     * @param Factory $viewFactory
     * @param Package $package
     * @internal param AssetPackage $assetPackage
     */
    public function __construct(RepositoryFactory $repositoryFactory,
                                AdminInterface $admin,
                                Factory $viewFactory,
                                Package $package)
    {
        $this->repositoryFactory = $repositoryFactory;
        $this->admin = $admin;
        $this->viewFactory = $viewFactory;
        $this->package = $package;

        $this->extensions = new Collection();

        $this->extend('actions', new Actions());
        $this->extend('filters', new Filters());
        $this->extend('apply', new Apply());
        $this->extend('scopes', new Scopes());
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

            if ($extension instanceof Placable) {
                $template = $this->admin->template()->getViewPath($this->getView());

                $this->viewFactory->composer($template, function (View $view) use ($extension) {
                    $html = $this->admin->template()->view($extension->getView(), $extension->toArray())->render();

                    if (! empty($html)) {
                        /* @var \Illuminate\View\View $view */
                        $view->getFactory()->inject($extension->getPlacement(), $html);
                    }
                });
            }
        });

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
            'title'      => $this->getTitle(),
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
     * @param string|View $view
     * @return $this
     */
    public function setView($view)
    {
        $this->view = $view;

        return $this;
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
        return $this->admin->getModel($this->modelClass);
    }

    /**
     * @return \Illuminate\Foundation\Application|mixed
     * @throws \Exception
     */
    protected function makeRepository()
    {
        $repository = $this->repositoryFactory->make($this->modelClass, $this->repositoryClass);

        if (! ($repository instanceof RepositoryInterface)) {
            throw new \Exception('Repository class must be instanced of [RepositoryInterface]');
        }

        return $repository;
    }
}
