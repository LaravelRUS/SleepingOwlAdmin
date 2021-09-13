<?php

namespace SleepingOwl\Admin\Model;

use BadMethodCallException;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use KodiComponents\Navigation\Contracts\BadgeInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;
use SleepingOwl\Admin\Navigation;
use SleepingOwl\Admin\Navigation\Badge;
use SleepingOwl\Admin\Navigation\Page;

/**
 * @method bool creating(\Closure $callback)
 * @method void created(\Closure $callback)
 * @method bool updating(\Closure $callback)
 * @method void updated(\Closure $callback)
 * @method bool deleting(\Closure $callback)
 * @method void deleted(\Closure $callback)
 * @method bool restoring(\Closure $callback)
 * @method void restored(\Closure $callback)
 */
abstract class ModelConfigurationManager implements ModelConfigurationInterface
{
    /**
     * Get the event dispatcher instance.
     *
     * @return \Illuminate\Contracts\Events\Dispatcher
     */
    public static function getEventDispatcher()
    {
        return self::$dispatcher;
    }

    /**
     * Set the event dispatcher instance.
     *
     * @param  \Illuminate\Contracts\Events\Dispatcher  $dispatcher
     * @return void
     */
    public static function setEventDispatcher(Dispatcher $dispatcher)
    {
        self::$dispatcher = $dispatcher;
    }

    /**
     * The event dispatcher instance.
     *
     * @var \Illuminate\Contracts\Events\Dispatcher
     */
    protected static $dispatcher;

    /**
     * @var \Illuminate\Contracts\Foundation\Application
     */
    protected $app;

    /**
     * @var string
     */
    protected $class;

    /**
     * @var Model
     */
    protected $model;

    /**
     * @var string
     */
    protected $alias;

    /**
     * @var string|null
     */
    protected $controllerClass;

    /**
     * @var string
     */
    protected $title;

    /**
     * @var string
     */
    protected $icon;

    /**
     * @var bool
     */
    protected $checkAccess = false;

    /**
     * @var array
     */
    protected $redirect = ['edit' => 'edit', 'create' => 'edit'];

    /**
     * @var RepositoryInterface
     */
    private $repository;

    /**
     * @var Model|null
     */
    protected $model_value = null;

    /**
     * ModelConfigurationManager constructor.
     *
     * @param  \Illuminate\Contracts\Foundation\Application  $app
     * @param  $class
     *
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     * @throws \SleepingOwl\Admin\Exceptions\RepositoryException
     */
    public function __construct(\Illuminate\Contracts\Foundation\Application $app, $class)
    {
        $this->app = $app;
        $this->class = $class;

        $this->model = $app->make($class);

        $this->repository = $app->make(RepositoryInterface::class);
        $this->repository->setClass($class);
        if (! $this->alias) {
            $this->setDefaultAlias();
        }
    }

    /**
     * @return string
     */
    public function getClass()
    {
        return $this->class;
    }

    /**
     * @return Model
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * @return Model|null
     */
    public function getModelValue()
    {
        return $this->model_value;
    }

    /**
     * @param  Model  $item
     */
    public function setModelValue($item)
    {
        $this->model_value = $item;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        if (is_null($this->title)) {
            $title = str_replace('_', ' ', $this->getDefaultClassTitle());
            $this->title = ucwords($title);
        }

        return $this->title;
    }

    /**
     * @return string
     */
    public function getIcon()
    {
        return $this->icon;
    }

    /**
     * @param  string  $icon
     * @return $this
     */
    public function setIcon($icon)
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * @return string
     */
    public function getAlias()
    {
        return $this->alias;
    }

    /**
     * @return RepositoryInterface
     */
    public function getRepository()
    {
        return $this->repository;
    }

    /**
     * @return string|array|\Symfony\Component\Translation\TranslatorInterface
     */
    public function getCreateTitle()
    {
        return trans('sleeping_owl::lang.model.create', ['title' => $this->getTitle()]);
    }

    /**
     * @return string|array|\Symfony\Component\Translation\TranslatorInterface
     */
    public function getEditTitle()
    {
        return trans('sleeping_owl::lang.model.edit', ['title' => $this->getTitle()]);
    }

    /**
     * @return bool
     */
    public function isDisplayable()
    {
        return $this->can('display', $this->getModel());
    }

    /**
     * @return bool
     */
    public function isCreatable()
    {
        return $this->can('create', $this->getModel());
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return bool
     */
    public function isEditable(Model $model)
    {
        return $this->can('edit', $model);
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return bool
     */
    public function isDeletable(Model $model)
    {
        return $this->can('delete', $model);
    }

    /**
     * @param  Model  $model
     * @return bool
     */
    public function isDestroyable(Model $model)
    {
        return $this->isRestorableModel() && $this->can('destroy', $model);
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return bool
     */
    public function isRestorable(Model $model)
    {
        return $this->isRestorableModel() && $this->can('restore', $model);
    }

    /**
     * @return bool
     */
    public function isRestorableModel()
    {
        return $this->getRepository()->isRestorable();
    }

    /**
     * @param  int  $id
     * @return $this
     *
     * @deprecated
     */
    public function fireFullEdit($id)
    {
        return $this->fireEdit($id);
    }

    /**
     * @return $this
     */
    public function enableAccessCheck()
    {
        $this->checkAccess = true;

        return $this;
    }

    /**
     * @return $this
     */
    public function disableAccessCheck()
    {
        $this->checkAccess = false;

        return $this;
    }

    /**
     * @param  string  $action
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return bool
     */
    public function can($action, Model $model)
    {
        if (! $this->checkAccess) {
            return true;
        }

        return \Gate::allows($action, [$this, $model]);
    }

    /**
     * @param  string  $controllerClass
     * @return $this
     */
    public function setControllerClass($controllerClass)
    {
        $this->controllerClass = $controllerClass;

        return $this;
    }

    /**
     * @return null|string
     */
    public function getControllerClass()
    {
        return $this->controllerClass;
    }

    /**
     * @return null|string|bool
     */
    public function hasCustomControllerClass()
    {
        $controller = $this->getControllerClass();

        return ! is_null($controller) && class_exists($controller);
    }

    /**
     * @param  array  $parameters
     * @return string
     */
    public function getDisplayUrl(array $parameters = [])
    {
        array_unshift($parameters, $this->getAlias());

        return route('admin.model', $parameters);
    }

    /**
     * @param  array  $parameters
     * @return string
     */
    public function getCancelUrl(array $parameters = [])
    {
        return $this->getDisplayUrl($parameters);
    }

    /**
     * @param  array  $parameters
     * @return string
     */
    public function getCreateUrl(array $parameters = [])
    {
        array_unshift($parameters, $this->getAlias());

        return route('admin.model.create', $parameters);
    }

    /**
     * @param  array  $parameters
     * @return string
     */
    public function getStoreUrl(array $parameters = [])
    {
        array_unshift($parameters, $this->getAlias());

        return route('admin.model.store', $parameters);
    }

    /**
     * @param  string|int  $id
     * @param  array  $parameters
     * @return string
     */
    public function getEditUrl($id, array $parameters = [])
    {
        if (! $id) {
            return '#';
        }

        array_unshift($parameters, $this->getAlias(), $id);

        return route('admin.model.edit', $parameters);
    }

    /**
     * @param  string|int  $id
     * @param  array  $parameters
     * @return string
     */
    public function getUpdateUrl($id, array $parameters = [])
    {
        if (! $id) {
            return '#';
        }

        array_unshift($parameters, $this->getAlias(), $id);

        return route('admin.model.update', $parameters);
    }

    /**
     * @param  string|int  $id
     * @param  array  $parameters
     * @return string
     */
    public function getDeleteUrl($id, array $parameters = [])
    {
        if (! $id) {
            return '#';
        }

        array_unshift($parameters, $this->getAlias(), $id);

        return route('admin.model.delete', $parameters);
    }

    /**
     * @param  string|int  $id
     * @param  array  $parameters
     * @return string
     */
    public function getDestroyUrl($id, array $parameters = [])
    {
        if (! $id) {
            return '#';
        }

        array_unshift($parameters, $this->getAlias(), $id);

        return route('admin.model.destroy', $parameters);
    }

    /**
     * @param  string|int  $id
     * @param  array  $parameters
     * @return string
     */
    public function getRestoreUrl($id, array $parameters = [])
    {
        if (! $id) {
            return '#';
        }

        array_unshift($parameters, $this->getAlias(), $id);

        return route('admin.model.restore', $parameters);
    }

    /**
     * @return string|array
     */
    public function getMessageOnCreate()
    {
        return trans('sleeping_owl::lang.message.created');
    }

    /**
     * @return string|array
     */
    public function getMessageOnUpdate()
    {
        return trans('sleeping_owl::lang.message.updated');
    }

    /**
     * @return string|array
     */
    public function getMessageOnDelete()
    {
        return trans('sleeping_owl::lang.message.deleted');
    }

    /**
     * @return string|array
     */
    public function getMessageOnRestore()
    {
        return trans('sleeping_owl::lang.message.restored');
    }

    /**
     * @return string|array
     */
    public function getMessageOnDestroy()
    {
        return trans('sleeping_owl::lang.message.destroyed');
    }

    /**
     * @return Navigation
     */
    public function getNavigation()
    {
        return $this->app['sleeping_owl.navigation'];
    }

    /**
     * @param  int  $priority
     * @param  string|\Closure|BadgeInterface  $badge
     * @return Page
     */
    public function addToNavigation($priority = 100, $badge = null)
    {
        $page = $this->makePage($priority, $badge);

        $this->getNavigation()->addPage($page);

        return $page;
    }

    /**
     * @param $page_id
     * @return \KodiComponents\Navigation\Contracts\PageInterface|null
     */
    public function getNavigationPage($page_id)
    {
        return $this->getNavigation()->getPages()->findById($page_id);
    }

    /**
     * @param  int  $priority
     * @param  string|\Closure|BadgeInterface  $badge
     * @return Page
     */
    protected function makePage($priority = 100, $badge = null)
    {
        $page = new Page($this->getClass());
        $page->setPriority($priority);

        if ($badge) {
            if (! ($badge instanceof BadgeInterface)) {
                $badge = new Badge($badge);
            }

            $page->setBadge($badge);
        }

        return $page;
    }

    /**
     * @param  array  $redirect
     * @return $this
     */
    public function setRedirect(array $redirect)
    {
        $this->redirect = $redirect;

        return $this;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function getRedirect()
    {
        return collect($this->redirect);
    }

    /**
     * Fire the given event for the model.
     *
     * @param  string  $event
     * @param  bool  $halt
     * @param  Model|null  $model
     * @param  array  $payload
     * @return mixed
     */
    public function fireEvent($event, $halt = true, Model $model = null, ...$payload)
    {
        if (! isset(self::$dispatcher)) {
            return true;
        }

        if (is_null($model)) {
            $model = $this->getModel();
        }

        // We will append the names of the class to the event to distinguish it from
        // other model events that are fired, allowing us to listen on each model
        // event set individually instead of catching event for all the models.
        $event = "sleeping_owl.section.{$event}: ".$this->getClass();

        // Laravel 5.8 and 5.4 support fire method
        if (version_compare('5.8.0', $this->app->version(), '<=') ||
            version_compare('5.5.0', $this->app->version(), '>')) {
            $fireMethod = 'dispatch';
        } else {
            $fireMethod = 'fire';
        }

        $method = $halt ? 'until' : $fireMethod;

        array_unshift($payload, $this, $model);

        return self::$dispatcher->$method($event, $payload);
    }

    /**
     * Handle dynamic method calls into the model.
     *
     * @param $method
     * @param $arguments
     * @return mixed
     */
    public function __call($method, $arguments)
    {
        if (in_array($method, [
            'creating', 'created', 'updating', 'updated', 'saving', 'saved',
            'deleting', 'deleted', 'restoring', 'restored',
        ])) {
            array_unshift($arguments, $method);

            return call_user_func_array([$this, 'registerEvent'], $arguments);
        }

        throw new BadMethodCallException($method);
    }

    /**
     * @param  $event
     * @param  $callback
     * @param  int  $priority
     */
    protected function registerEvent($event, $callback, $priority = 0)
    {
        if (isset(self::$dispatcher)) {
            self::$dispatcher->listen("sleeping_owl.section.{$event}: ".$this->getClass(), $callback, $priority);
        }
    }

    protected function setDefaultAlias()
    {
        $this->alias = $this->getDefaultClassTitle();
    }

    /**
     * @return string
     */
    protected function getDefaultClassTitle()
    {
        return Str::snake(Str::plural(class_basename($this->getClass())));
    }
}
