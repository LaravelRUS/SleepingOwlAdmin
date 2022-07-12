<?php

namespace SleepingOwl\Admin\Model;

use BadMethodCallException;
use Closure;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Translation\Translator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use KodiComponents\Navigation\Contracts\BadgeInterface;
use KodiComponents\Navigation\Contracts\PageInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;
use SleepingOwl\Admin\Exceptions\RepositoryException;
use SleepingOwl\Admin\Navigation;
use SleepingOwl\Admin\Navigation\Badge;
use SleepingOwl\Admin\Navigation\Page;

/**
 * @method bool creating(Closure $callback)
 * @method void created(Closure $callback)
 * @method bool updating(Closure $callback)
 * @method void updated(Closure $callback)
 * @method bool deleting(Closure $callback)
 * @method void deleted(Closure $callback)
 * @method bool restoring(Closure $callback)
 * @method void restored(Closure $callback)
 */
abstract class ModelConfigurationManager implements ModelConfigurationInterface
{
    /**
     * Get the event dispatcher instance.
     *
     * @return Dispatcher
     */
    public static function getEventDispatcher(): Dispatcher
    {
        return self::$dispatcher;
    }

    /**
     * Set the event dispatcher instance.
     *
     * @param  Dispatcher  $dispatcher
     * @return void
     */
    public static function setEventDispatcher(Dispatcher $dispatcher)
    {
        self::$dispatcher = $dispatcher;
    }

    /**
     * The event dispatcher instance.
     *
     * @var Dispatcher
     */
    protected static Dispatcher $dispatcher;

    /**
     * @var Application
     */
    protected Application $app;

    /**
     * @var string
     */
    protected $class;

    /**
     * @var Model
     */
    protected Model $model;

    /**
     * @var null|string
     */
    protected $alias = null;

    /**
     * @var string|null
     */
    protected ?string $controllerClass = null;

    /**
     * @var string
     */
    protected $title;

    /**
     * @var string|null
     */
    protected $icon = null;

    /**
     * @var bool
     */
    protected $checkAccess = false;

    /**
     * @var array
     */
    protected array $redirect = ['edit' => 'edit', 'create' => 'edit'];

    /**
     * @var RepositoryInterface
     */
    private RepositoryInterface $repository;

    /**
     * @var Model|null
     */
    protected ?Model $model_value = null;

    /**
     * ModelConfigurationManager constructor.
     *
     * @param  Application  $app
     * @param  $class
     *
     * @throws BindingResolutionException
     * @throws RepositoryException
     */
    public function __construct(Application $app, $class)
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
    public function getClass(): string
    {
        return $this->class;
    }

    /**
     * @return Model
     */
    public function getModel(): Model
    {
        return $this->model;
    }

    /**
     * @return Model|null
     */
    public function getModelValue(): ?Model
    {
        return $this->model_value;
    }

    /**
     * @param  Model  $item
     */
    public function setModelValue(Model $item)
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
     * @return string|null
     */
    public function getIcon(): ?string
    {
        return $this->icon;
    }

    /**
     * @param  string  $icon
     * @return $this
     */
    public function setIcon(string $icon): ModelConfigurationManager
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * @return string
     */
    public function getAlias(): string
    {
        return $this->alias;
    }

    /**
     * @return RepositoryInterface
     */
    public function getRepository(): RepositoryInterface
    {
        return $this->repository;
    }

    /**
     * @return Translator
     */
    public function getCreateTitle(): Translator
    {
        return trans('sleeping_owl::lang.model.create', ['title' => $this->getTitle()]);
    }

    /**
     * @return Translator
     */
    public function getEditTitle(): Translator
    {
        return trans('sleeping_owl::lang.model.edit', ['title' => $this->getTitle()]);
    }

    /**
     * @return bool
     */
    public function isDisplayable(): bool
    {
        return $this->can('display', $this->getModel());
    }

    /**
     * @return bool
     */
    public function isCreatable(): bool
    {
        return $this->can('create', $this->getModel());
    }

    /**
     * @param  Model  $model
     * @return bool
     */
    public function isEditable(Model $model): bool
    {
        return $this->can('edit', $model);
    }

    /**
     * @param  Model  $model
     * @return bool
     */
    public function isDeletable(Model $model): bool
    {
        return $this->can('delete', $model);
    }

    /**
     * @param  Model  $model
     * @return bool
     */
    public function isDestroyable(Model $model): bool
    {
        return $this->isRestorableModel() && $this->can('destroy', $model);
    }

    /**
     * @param  Model  $model
     * @return bool
     */
    public function isRestorable(Model $model): bool
    {
        return $this->isRestorableModel() && $this->can('restore', $model);
    }

    /**
     * @return bool
     */
    public function isRestorableModel(): bool
    {
        return $this->getRepository()->isRestorable();
    }

    /**
     * @return $this
     */
    public function enableAccessCheck(): ModelConfigurationManager
    {
        $this->checkAccess = true;

        return $this;
    }

    /**
     * @return $this
     */
    public function disableAccessCheck(): ModelConfigurationManager
    {
        $this->checkAccess = false;

        return $this;
    }

    /**
     * @param  string  $action
     * @param  Model  $model
     * @return bool
     */
    public function can(string $action, Model $model): bool
    {
        if (! $this->checkAccess) {
            return true;
        }

        return Gate::allows($action, [$this, $model]);
    }

    /**
     * @param  string  $controllerClass
     * @return $this
     */
    public function setControllerClass(string $controllerClass): ModelConfigurationManager
    {
        $this->controllerClass = $controllerClass;

        return $this;
    }

    /**
     * @return null|string
     */
    public function getControllerClass(): ?string
    {
        return $this->controllerClass;
    }

    /**
     * @return bool
     */
    public function hasCustomControllerClass(): bool
    {
        $controller = $this->getControllerClass();

        return ! is_null($controller) && class_exists($controller);
    }

    /**
     * @param  array  $parameters
     * @return string
     */
    public function getDisplayUrl(array $parameters = []): string
    {
        array_unshift($parameters, $this->getAlias());

        return route('admin.model', $parameters);
    }

    /**
     * @param  array  $parameters
     * @return string
     */
    public function getCancelUrl(array $parameters = []): string
    {
        return $this->getDisplayUrl($parameters);
    }

    /**
     * @param  array  $parameters
     * @return string
     */
    public function getCreateUrl(array $parameters = []): string
    {
        array_unshift($parameters, $this->getAlias());

        return route('admin.model.create', $parameters);
    }

    /**
     * @param  array  $parameters
     * @return string
     */
    public function getStoreUrl(array $parameters = []): string
    {
        array_unshift($parameters, $this->getAlias());

        return route('admin.model.store', $parameters);
    }

    /**
     * @param  int|string  $id
     * @param  array  $parameters
     * @return string
     */
    public function getEditUrl(int|string $id, array $parameters = []): string
    {
        if (! $id) {
            return '#';
        }

        array_unshift($parameters, $this->getAlias(), $id);

        return route('admin.model.edit', $parameters);
    }

    /**
     * @param  int|string  $id
     * @param  array  $parameters
     * @return string
     */
    public function getUpdateUrl(int|string $id, array $parameters = []): string
    {
        if (! $id) {
            return '#';
        }

        array_unshift($parameters, $this->getAlias(), $id);

        return route('admin.model.update', $parameters);
    }

    /**
     * @param  int|string  $id
     * @param  array  $parameters
     * @return string
     */
    public function getDeleteUrl(int|string $id, array $parameters = []): string
    {
        if (! $id) {
            return '#';
        }

        array_unshift($parameters, $this->getAlias(), $id);

        return route('admin.model.delete', $parameters);
    }

    /**
     * @param  int|string  $id
     * @param  array  $parameters
     * @return string
     */
    public function getDestroyUrl(int|string $id, array $parameters = []): string
    {
        if (! $id) {
            return '#';
        }

        array_unshift($parameters, $this->getAlias(), $id);

        return route('admin.model.destroy', $parameters);
    }

    /**
     * @param  int|string  $id
     * @param  array  $parameters
     * @return string
     */
    public function getRestoreUrl(int|string $id, array $parameters = []): string
    {
        if (! $id) {
            return '#';
        }

        array_unshift($parameters, $this->getAlias(), $id);

        return route('admin.model.restore', $parameters);
    }

    /**
     * @return string
     */
    public function getMessageOnCreate(): string
    {
        return trans('sleeping_owl::lang.message.created');
    }

    /**
     * @return string
     */
    public function getMessageOnUpdate(): string
    {
        return trans('sleeping_owl::lang.message.updated');
    }

    /**
     * @return string
     */
    public function getMessageOnDelete(): string
    {
        return trans('sleeping_owl::lang.message.deleted');
    }

    /**
     * @return string
     */
    public function getMessageOnRestore(): string
    {
        return trans('sleeping_owl::lang.message.restored');
    }

    /**
     * @return string
     */
    public function getMessageOnDestroy(): string
    {
        return trans('sleeping_owl::lang.message.destroyed');
    }

    /**
     * @return Navigation
     */
    public function getNavigation(): Navigation
    {
        return $this->app['sleeping_owl.navigation'];
    }

    /**
     * @param  int  $priority
     * @param  string|Closure|BadgeInterface|null  $badge
     * @return Page
     */
    public function addToNavigation(int $priority = 100, BadgeInterface|string|Closure $badge = null): Page
    {
        $page = $this->makePage($priority, $badge);

        $this->getNavigation()->addPage($page);

        return $page;
    }

    /**
     * @param $page_id
     * @return PageInterface|null
     */
    public function getNavigationPage($page_id): ?PageInterface
    {
        return $this->getNavigation()->getPages()->findById($page_id);
    }

    /**
     * @param  int  $priority
     * @param  string|Closure|BadgeInterface|null  $badge
     * @return Page
     */
    protected function makePage(int $priority = 100, BadgeInterface|string|Closure $badge = null): Page
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
    public function setRedirect(array $redirect): ModelConfigurationInterface
    {
        $this->redirect = $redirect;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getRedirect(): Collection
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
    public function fireEvent(string $event, bool $halt = true, Model $model = null, ...$payload): mixed
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
        $event = 'sleeping_owl.section.'.$event.': '.$this->getClass();

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
    protected function registerEvent($event, $callback, int $priority = 0)
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
    protected function getDefaultClassTitle(): string
    {
        return Str::snake(Str::plural(class_basename($this->getClass())));
    }
}
