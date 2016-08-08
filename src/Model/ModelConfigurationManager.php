<?php

namespace SleepingOwl\Admin\Model;

use BadMethodCallException;
use Illuminate\Contracts\Auth\Access\Gate;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Database\Eloquent\Model;
use KodiComponents\Navigation\Contracts\BadgeInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Navigation\PageInterface;
use SleepingOwl\Admin\Contracts\NavigationInterface;
use SleepingOwl\Admin\Contracts\RepositoryInterface;
use SleepingOwl\Admin\Navigation\Badge;
use SleepingOwl\Admin\Navigation\Page;
use Symfony\Component\Translation\TranslatorInterface;

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
     * The event dispatcher instance.
     *
     * @var Dispatcher
     */
    protected $dispatcher;

    /**
     * @var TranslatorInterface
     */
    protected $translator;

    /**
     * @var UrlGenerator
     */
    protected $urlGenerator;

    /**
     * @var NavigationInterface
     */
    protected $navigation;

    /**
     * @var Gate
     */
    protected $gate;

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
     * @var RepositoryInterface
     */
    private $repository;

    /**
     * ModelConfigurationManager constructor.
     *
     * @param Dispatcher $dispatcher
     * @param TranslatorInterface $translator
     * @param UrlGenerator $urlGenerator
     * @param RepositoryInterface $repository
     * @param NavigationInterface $navigation
     * @param Gate $gate
     */
    public function __construct(Dispatcher $dispatcher,
                                TranslatorInterface $translator,
                                UrlGenerator $urlGenerator,
                                RepositoryInterface $repository,
                                NavigationInterface $navigation,
                                Gate $gate)
    {
        $this->repository = $repository;
        $this->dispatcher = $dispatcher;
        $this->translator = $translator;
        $this->urlGenerator = $urlGenerator;
        $this->navigation = $navigation;
        $this->gate = $gate;

        $this->model = $repository->getModel();
        $this->class = get_class($this->model);

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
     * @param string $icon
     *
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
     * @return string|TranslatorInterface
     */
    public function getCreateTitle()
    {
        return $this->translator->trans('sleeping_owl::lang.model.create', ['title' => $this->getTitle()]);
    }

    /**
     * @return string|TranslatorInterface
     */
    public function getEditTitle()
    {
        return $this->translator->trans('sleeping_owl::lang.model.edit', ['title' => $this->getTitle()]);
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
     * @param \Illuminate\Database\Eloquent\Model $model
     *
     * @return bool
     */
    public function isEditable(Model $model)
    {
        return $this->can('edit', $model);
    }

    /**
     * @param \Illuminate\Database\Eloquent\Model $model
     *
     * @return bool
     */
    public function isDeletable(Model $model)
    {
        return $this->can('delete', $model);
    }

    /**
     * @param Model $model
     *
     * @return bool
     */
    public function isDestroyable(Model $model)
    {
        return $this->isRestorableModel() && $this->can('destroy', $model);
    }

    /**
     * @param \Illuminate\Database\Eloquent\Model $model
     *
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
     * @deprecated
     * @param int $id
     *
     * @return $this
     */
    public function fireFullEdit($id)
    {
        return $this->fireEdit($id);
    }

    /**
     * @param string $action
     * @param \Illuminate\Database\Eloquent\Model $model
     *
     * @return bool
     */
    public function can($action, Model $model)
    {
        if (! $this->checkAccess) {
            return true;
        }

        return $this->gate->allows($action, $model);
    }

    /**
     * @return null|string
     */
    public function getControllerClass()
    {
        return $this->controllerClass;
    }

    /**
     * @return null|string
     */
    public function hasCustomControllerClass()
    {
        return ! is_null($controller = $this->getControllerClass()) and class_exists($controller);
    }

    /**
     * @param array $parameters
     *
     * @return string
     */
    public function getDisplayUrl(array $parameters = [])
    {
        array_unshift($parameters, $this->getAlias());

        return $this->urlGenerator->route('admin.model', $parameters);
    }

    /**
     * @param array $parameters
     *
     * @return string
     */
    public function getCreateUrl(array $parameters = [])
    {
        array_unshift($parameters, $this->getAlias());

        return $this->urlGenerator->route('admin.model.create', $parameters);
    }

    /**
     * @return string
     */
    public function getStoreUrl()
    {
        return $this->urlGenerator->route('admin.model.store', $this->getAlias());
    }

    /**
     * @param string|int $id
     *
     * @return string
     */
    public function getEditUrl($id)
    {
        return $this->urlGenerator->route('admin.model.edit', [$this->getAlias(), $id]);
    }

    /**
     * @param string|int $id
     *
     * @return string
     */
    public function getUpdateUrl($id)
    {
        return $this->urlGenerator->route('admin.model.update', [$this->getAlias(), $id]);
    }

    /**
     * @param string|int $id
     *
     * @return string
     */
    public function getDeleteUrl($id)
    {
        return $this->urlGenerator->route('admin.model.delete', [$this->getAlias(), $id]);
    }

    /**
     * @param string|int $id
     *
     * @return string
     */
    public function getDestroyUrl($id)
    {
        return $this->urlGenerator->route('admin.model.destroy', [$this->getAlias(), $id]);
    }

    /**
     * @param string|int $id
     *
     * @return string
     */
    public function getRestoreUrl($id)
    {
        return $this->urlGenerator->route('admin.model.restore', [$this->getAlias(), $id]);
    }

    /**
     * @return string
     */
    public function getMessageOnCreate()
    {
        return $this->translator->trans('sleeping_owl::lang.message.created');
    }

    /**
     * @return string
     */
    public function getMessageOnUpdate()
    {
        return $this->translator->trans('sleeping_owl::lang.message.updated');
    }

    /**
     * @return string
     */
    public function getMessageOnDelete()
    {
        return $this->translator->trans('sleeping_owl::lang.message.deleted');
    }

    /**
     * @return string
     */
    public function getMessageOnRestore()
    {
        return $this->translator->trans('sleeping_owl::lang.message.restored');
    }

    /**
     * @return string
     */
    public function getMessageOnDestroy()
    {
        return $this->translator->trans('sleeping_owl::lang.message.destroyed');
    }

    /**
     * @param int $priority
     * @param string|\Closure|BadgeInterface $badge
     *
     * @return PageInterface
     */
    public function addToNavigation($priority = 100, $badge = null)
    {
        $page = new Page($this->getClass());
        $page->setPriority($priority);

        if ($badge) {
            if (! ($badge instanceof BadgeInterface)) {
                $badge = new Badge($badge);
            }

            $page->setBadge($badge);
        }

        $this->navigation->addPage($page);

        return $page;
    }

    /**
     * Fire the given event for the model.
     *
     * @param string     $event
     * @param bool       $halt
     * @param Model|null $model
     *
     * @return mixed
     */
    public function fireEvent($event, $halt = true, Model $model = null)
    {
        if (is_null($model)) {
            $model = $this->getModel();
        }

        // We will append the names of the class to the event to distinguish it from
        // other model events that are fired, allowing us to listen on each model
        // event set individually instead of catching event for all the models.
        $event = "sleeping_owl.section.{$event}: ".$this->getClass();

        $method = $halt ? 'until' : 'fire';

        return $this->dispatcher->$method($event, [$this, $model]);
    }

    /**
     * Handle dynamic method calls into the model.
     *
     * @param $method
     * @param $arguments
     *
     * @return mixed
     */
    public function __call($method, $arguments)
    {
        if (in_array($method, [
            'creating', 'created', 'updating', 'updated',
            'deleting', 'deleted', 'restoring', 'restored',
        ])) {
            array_unshift($arguments, $method);

            return call_user_func_array([$this, 'registerEvent'], $arguments);
        }

        throw new BadMethodCallException($method);
    }

    /**
     * @param     $event
     * @param     $callback
     * @param int $priority
     */
    protected function registerEvent($event, $callback, $priority = 0)
    {
        $this->dispatcher->listen("sleeping_owl.section.{$event}: ".$this->getClass(), $callback, $priority);
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
        return snake_case(str_plural(class_basename($this->getClass())));
    }
}
