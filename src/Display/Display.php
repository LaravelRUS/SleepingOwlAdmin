<?php

namespace SleepingOwl\Admin\Display;

use Illuminate\Support\Collection;
use SleepingOwl\Admin\Traits\Assets;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Display\Extension\Apply;
use SleepingOwl\Admin\Contracts\AdminInterface;
use SleepingOwl\Admin\Display\Extension\Scopes;
use SleepingOwl\Admin\Contracts\ActionInterface;
use SleepingOwl\Admin\Contracts\FilterInterface;
use SleepingOwl\Admin\Display\Extension\Actions;
use SleepingOwl\Admin\Display\Extension\Filters;
use SleepingOwl\Admin\Contracts\Display\Placable;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Display\DisplayExtensionInterface;

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
     * @var array
     */
    protected $with = [];

    /**
     * @var string
     */
    protected $title;

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
     * @var TemplateInterface
     */
    protected $template;

    /**
     * @var AdminInterface
     */
    protected $admin;

    /**
     * @var ModelConfigurationInterface
     */
    protected $modelConfiguration;

    /**
     * Display constructor.
     *
     * @param AdminInterface $admin
     * @param RepositoryInterface $repository
     */
    public function __construct(AdminInterface $admin, RepositoryInterface $repository)
    {
        $this->extensions = new Collection();
        $this->template = $admin->template();
        $this->repository = $repository;

        $this->extend('actions', new Actions());
        $this->extend('filters', new Filters());
        $this->extend('apply', new Apply());
        $this->extend('scopes', new Scopes());

        $this->initializePackage(
            $this->template->meta()
        );

        $this->admin = $admin;
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

        $this->repository->with($this->with);

        $this->extensions->each(function (DisplayExtensionInterface $extension) {
            if ($extension instanceof Initializable) {
                $extension->initialize();
            }
        });

        $this->includePackage(
            $this->template->meta()
        );

        $this->initialized = true;
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
        $view = $this->template->view($this->getView(), $this->toArray());

        $blocks = [];

        $placableExtensions = $this->getExtensions()->filter(function ($extension) {
            return $extension instanceof Placable;
        });

        foreach ($placableExtensions as $extension) {
            $blocks[$extension->getPlacement()][] = $this->template->view(
                $extension->getView(),
                $extension->toArray()
            )->render();
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

        return $view->render();
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
     * @return TemplateInterface
     */
    public function template()
    {
        return $this->template;
    }

    /**
     * @return ModelConfigurationInterface
     */
    public function getModelConfiguration()
    {
        return $this->modelConfiguration;
    }

    /**
     * @param ModelConfigurationInterface $model
     *
     * @return $this
     */
    public function setModelConfiguration(ModelConfigurationInterface $model)
    {
        $this->modelConfiguration = $model;
        $this->repository->setClass($model->getClass());

        return $this;
    }
}
