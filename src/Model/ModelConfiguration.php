<?php

namespace SleepingOwl\Admin\Model;

use Gate;
use Closure;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Repository\BaseRepository;
use SleepingOwl\Admin\Contracts\DisplayInterface;

class ModelConfiguration
{
    /**
     * @var string
     */
    protected $class;

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
     * @var Closure|null
     */
    protected $display;

    /**
     * @var Closure|null
     */
    protected $create;

    /**
     * @var bool
     */
    protected $displayable = true;

    /**
     * @var bool
     */
    protected $creatable = true;

    /**
     * @var bool
     */
    protected $editable = true;

    /**
     * @var bool
     */
    protected $restorable = true;

    /**
     * @var bool
     */
    protected $deletable = true;

    /**
     * @var bool
     */
    protected $checkAccess = false;

    /**
     * @var Closure|null
     */
    protected $edit;

    /**
     * @var Closure|null
     */
    protected $delete = true;

    /**
     * @var Closure|null
     */
    protected $restore = true;

    /**
     * @var string
     */
    protected $messageOnCreate;

    /**
     * @var string
     */
    protected $messageOnUpdate;

    /**
     * @var string
     */
    protected $messageOnDelete;

    /**
     * @var string
     */
    protected $messageOnRestore;

    /**
     * ModelConfiguration constructor.
     *
     * @param string $class
     */
    public function __construct($class)
    {
        $this->class = $class;
        $this->setDefaultAlias();
    }

    /**
     * @return BaseRepository
     */
    public function getRepository()
    {
        return new BaseRepository($this->getClass());
    }

    /**
     * @return string
     */
    public function getClass()
    {
        return $this->class;
    }

    /**
     * @return string
     */
    public function getAlias()
    {
        return $this->alias;
    }

    /**
     * @param string $alias
     *
     * @return $this
     */
    public function setAlias($alias)
    {
        $this->alias = $alias;

        return $this;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
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
     * @return Closure|null
     */
    public function getRestore()
    {
        return $this->restore;
    }

    /**
     * @return Closure|null
     */
    public function getDelete()
    {
        return $this->delete;
    }

    /**
     * @return Closure|null
     */
    public function getEdit()
    {
        return $this->edit;
    }

    /**
     * @return Closure|null
     */
    public function getCreate()
    {
        return $this->create;
    }

    /**
     * @return Closure|null
     */
    public function getDisplay()
    {
        return $this->display;
    }

    /**
     * @param Closure|null $callback
     *
     * @return $this
     */
    public function onCreate(Closure $callback = null)
    {
        $this->create = $callback;

        return $this;
    }

    /**
     * @param Closure|null $callback
     *
     * @return $this
     */
    public function onEdit(Closure $callback = null)
    {
        $this->edit = $callback;

        return $this;
    }

    /**
     * @param Closure|null $callback
     *
     * @return $this
     */
    public function onCreateAndEdit(Closure $callback = null)
    {
        $this->onCreate($callback);
        $this->onEdit($callback);

        return $this;
    }

    /**
     * @param Closure|null $callback
     *
     * @return $this
     */
    public function onDelete(Closure $callback = null)
    {
        $this->delete = $callback;

        return $this;
    }

    /**
     * @param Closure|null $callback
     *
     * @return $this
     */
    public function onRestore(Closure $callback = null)
    {
        $this->restore = $callback;

        return $this;
    }

    /**
     * @param Closure $callback
     *
     * @return $this
     */
    public function onDisplay(Closure $callback)
    {
        $this->display = $callback;

        return $this;
    }

    /**
     * @return bool
     */
    public function isDisplayable()
    {
        return $this->displayable && $this->can('display', $this->makeModel());
    }

    /**
     * @return $this
     */
    public function disableDisplay()
    {
        $this->displayable = false;

        return $this;
    }

    /**
     * @return bool
     */
    public function isCreatable()
    {
        if (! is_callable($this->getCreate())) {
            return false;
        }

        return $this->creatable && $this->can('create', $this->makeModel());
    }

    /**
     * @return $this
     */
    public function disableCreating()
    {
        $this->creatable = false;

        return $this;
    }

    /**
     * @param Model $model
     *
     * @return bool
     */
    public function isEditable(Model $model)
    {
        if (! is_callable($this->getEdit())) {
            return false;
        }

        return $this->editable && $this->can('edit', $model);
    }

    /**
     * @return $this
     */
    public function disableEditing()
    {
        $this->editable = false;

        return $this;
    }

    /**
     * @param Model $model
     *
     * @return bool
     */
    public function isDeletable(Model $model)
    {
        return $this->deletable && $this->can('delete', $model);
    }

    /**
     * @return $this
     */
    public function disableDeleting()
    {
        $this->deletable = false;

        return $this;
    }

    /**
     * @param Model $model
     *
     * @return bool
     */
    public function isRestorable(Model $model)
    {
        return $this->restorable && $this->can('restore', $model);
    }

    /**
     * @return $this
     */
    public function disableRestoring()
    {
        $this->restorable = false;

        return $this;
    }

    /**
     * @param string $action
     * @param Model  $model
     *
     * @return bool
     */
    public function can($action, Model $model)
    {
        if (! $this->checkAccess) {
            return true;
        }

        return Gate::allows($action, $model);
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
     * @return DisplayInterface|mixed
     */
    public function fireDisplay()
    {
        if (! is_callable($this->display)) {
            return;
        }

        $display = app()->call($this->display);
        if ($display instanceof DisplayInterface) {
            $display->setModelClass($this->getClass());
            $display->initialize();
        }

        return $display;
    }

    /**
     * @return mixed|void
     */
    public function fireCreate()
    {
        if (! is_callable($this->create)) {
            return;
        }

        $create = app()->call($this->create);
        if ($create instanceof DisplayInterface) {
            $create->setModelClass($this->getClass());
            $create->initialize();
        }
        if ($create instanceof FormInterface) {
            $create->setAction($this->getStoreUrl());
        }

        return $create;
    }

    /**
     * @param $id
     *
     * @return mixed|void
     */
    public function fireEdit($id)
    {
        if (! is_callable($this->edit)) {
            return;
        }

        $edit = app()->call($this->edit, ['id' => $id]);
        if ($edit instanceof DisplayInterface) {
            $edit->setModelClass($this->getClass());
            $edit->initialize();
        }

        return $edit;
    }

    /**
     * @param int $id
     *
     * @return $this
     */
    public function fireFullEdit($id)
    {
        $edit = $this->fireEdit($id);

        if ($edit instanceof FormInterface) {
            $edit->setAction($this->getUpdateUrl($id));
            $edit->setId($id);
        }

        return $edit;
    }

    /**
     * @param $id
     *
     * @return mixed
     */
    public function fireDelete($id)
    {
        if (is_callable($this->getDelete())) {
            return app()->call($this->getDelete(), [$id]);
        }
    }

    /**
     * @param $id
     *
     * @return bool|mixed
     */
    public function fireRestore($id)
    {
        if (is_callable($this->getRestore())) {
            return app()->call($this->getRestore(), [$id]);
        }

        return $this->getRestore();
    }

    /**
     * @param array $parameters
     *
     * @return string
     */
    public function getDisplayUrl(array $parameters = [])
    {
        array_unshift($parameters, $this->getAlias());

        return route('admin.model', $parameters);
    }

    /**
     * @param array $parameters
     *
     * @return string
     */
    public function getCreateUrl(array $parameters = [])
    {
        array_unshift($parameters, $this->getAlias());

        return route('admin.model.create', $parameters);
    }

    /**
     * @return string
     */
    public function getStoreUrl()
    {
        return route('admin.model.store', $this->getAlias());
    }

    /**
     * @param string|int $id
     *
     * @return string
     */
    public function getEditUrl($id)
    {
        return route('admin.model.edit', [$this->getAlias(), $id]);
    }

    /**
     * @param string|int $id
     *
     * @return string
     */
    public function getUpdateUrl($id)
    {
        return route('admin.model.update', [$this->getAlias(), $id]);
    }

    /**
     * @param string|int $id
     *
     * @return string
     */
    public function getDeleteUrl($id)
    {
        return route('admin.model.destroy', [$this->getAlias(), $id]);
    }

    /**
     * @param string|int $id
     *
     * @return string
     */
    public function getRestoreUrl($id)
    {
        return route('admin.model.restore', [$this->getAlias(), $id]);
    }

    /**
     * @return string
     */
    public function getMessageOnCreate()
    {
        if (is_null($this->messageOnUpdate)) {
            $this->messageOnUpdate = trans('sleeping_owl::lang.message.created');
        }

        return $this->messageOnCreate;
    }

    /**
     * @param string $messageOnCreate
     */
    public function setMessageOnCreate($messageOnCreate)
    {
        $this->messageOnCreate = $messageOnCreate;
    }

    /**
     * @return string
     */
    public function getMessageOnUpdate()
    {
        if (is_null($this->messageOnUpdate)) {
            $this->messageOnUpdate = trans('sleeping_owl::lang.message.updated');
        }

        return $this->messageOnUpdate;
    }

    /**
     * @param string $messageOnUpdate
     *
     * @return $this
     */
    public function setMessageOnUpdate($messageOnUpdate)
    {
        $this->messageOnUpdate = $messageOnUpdate;

        return $this;
    }

    /**
     * @return string
     */
    public function getMessageOnDelete()
    {
        if (is_null($this->messageOnDelete)) {
            $this->messageOnDelete = trans('sleeping_owl::lang.message.deleted');
        }

        return $this->messageOnDelete;
    }

    /**
     * @param string $messageOnDelete
     *
     * @return $this
     */
    public function setMessageOnDelete($messageOnDelete)
    {
        $this->messageOnDelete = $messageOnDelete;

        return $this;
    }

    /**
     * @return string
     */
    public function getMessageOnRestore()
    {
        if (is_null($this->messageOnRestore)) {
            $this->messageOnRestore = trans('sleeping_owl::lang.message.restored');
        }

        return $this->messageOnRestore;
    }

    /**
     * @param string $messageOnRestore
     *
     * @return $this
     */
    public function setMessageOnRestore($messageOnRestore)
    {
        $this->messageOnRestore = $messageOnRestore;

        return $this;
    }

    /**
     * @return null|string
     */
    public function hasCustomControllerClass()
    {
        return ! is_null($controller = $this->getControllerClass()) and class_exists($controller);
    }

    /**
     * @return null|string
     */
    public function getControllerClass()
    {
        return $this->controllerClass;
    }

    /**
     * @param string $controllerClass
     *
     * @return $this
     */
    public function setControllerClass($controllerClass)
    {
        $this->controllerClass = $controllerClass;

        return $this;
    }

    protected function setDefaultAlias()
    {
        $alias = Str::snake(Str::plural(class_basename($this->getClass())));
        $this->setAlias($alias);
    }

    /**
     * @return Model
     */
    protected function makeModel()
    {
        return app()->make($this->getClass());
    }
}
