<?php

namespace SleepingOwl\Admin\Model;

use Closure;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\Display\DisplayInterface;
use SleepingOwl\Admin\Contracts\Form\FormInterface;
use SleepingOwl\Admin\Contracts\Initializable;
use SleepingOwl\Admin\Display\DisplayDatatablesAsync;

class ModelConfiguration extends ModelConfigurationManager
{
    /**
     * @var string
     */
    protected $createTitle;

    /**
     * @var string
     */
    protected $editTitle;

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
    protected $destroyable = true;

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
    protected $destroy = true;

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
    protected $messageOnDestroy;

    /**
     * @var string
     */
    protected $messageOnRestore;

    protected $breadcrumbs = null;

    public function __construct(\Illuminate\Contracts\Foundation\Application $app, $class)
    {
        parent::__construct($app, $class);
        $this->breadcrumbs = collect();
    }

    /**
     * @return \Illuminate\Support\Collection|null
     */
    public function getBreadCrumbs()
    {
        return $this->breadcrumbs->toArray();
    }

    /**
     * @param $breadcrumb
     * @return mixed|void
     */
    public function addBreadCrumb($breadcrumb)
    {
        $this->breadcrumbs->push($breadcrumb);
    }

    /**
     * @param  string  $alias
     * @return $this
     */
    public function setAlias($alias)
    {
        $this->alias = $alias;

        return $this;
    }

    /**
     * @param  string  $title
     * @return $this
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return string
     */
    public function getCreateTitle()
    {
        if (is_null($this->createTitle)) {
            return parent::getCreateTitle();
        }

        return $this->createTitle;
    }

    /**
     * @param  string  $title
     * @return $this
     */
    public function setCreateTitle($title)
    {
        $this->createTitle = $title;

        return $this;
    }

    /**
     * @param  Model  $model
     * @return string
     */
    public function getEditTitle()
    {
        if (is_null($this->editTitle)) {
            return parent::getEditTitle();
        }

        return $this->editTitle;
    }

    /**
     * @param  string  $title
     * @return $this
     */
    public function setEditTitle($title)
    {
        $this->editTitle = $title;

        return $this;
    }

    /**
     * @return bool
     */
    public function isDisplayable()
    {
        return $this->displayable && parent::isDisplayable();
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
     * @param  string  $action
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return bool
     */
    public function can($action, Model $model)
    {
        if (! $this->checkAccess) {
            return true;
        }

        return \Gate::allows($action, $model);
    }

    /**
     * @return bool
     */
    public function isCreatable()
    {
        if (! is_callable($this->getCreate())) {
            return false;
        }

        return $this->creatable && parent::isCreatable($this->getModel());
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
     * @param  Model  $model
     * @return bool
     */
    public function isEditable(Model $model)
    {
        if (! is_callable($this->getEdit())) {
            return false;
        }

        return $this->editable && parent::isEditable($model);
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
     * @param  bool  $deletable
     * @return $this
     */
    public function setDeletable($deletable)
    {
        $this->deletable = (bool) $deletable;

        return $this;
    }

    /**
     * @param  Model  $model
     * @return bool
     */
    public function isDeletable(Model $model)
    {
        return $this->deletable && parent::isDeletable($model);
    }

    /**
     * @return $this
     */
    public function disableDeleting()
    {
        $this->setDeletable(false);

        return $this;
    }

    /**
     * @param  Model  $model
     * @return bool
     */
    public function isDestroyable(Model $model)
    {
        return $this->destroyable && parent::isDestroyable($model);
    }

    /**
     * @return $this
     */
    public function disableDestroying()
    {
        $this->destroyable = false;

        return $this;
    }

    /**
     * @param  Model  $model
     * @return bool
     */
    public function isRestorable(Model $model)
    {
        return $this->restorable && parent::isRestorable($model);
    }

    /**
     * @return bool
     */
    public function isRestorableModel()
    {
        return $this->restorable && parent::isRestorableModel();
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
     * @return Closure|null
     */
    public function getDisplay()
    {
        return $this->display;
    }

    /**
     * @param  Closure  $callback
     * @return $this
     */
    public function onDisplay(Closure $callback)
    {
        $this->display = $callback;

        return $this;
    }

    /**
     * @param  mixed  $payload
     * @return DisplayInterface|mixed|void
     */
    public function fireDisplay($payload = [])
    {
        if (! is_callable($this->getDisplay())) {
            return;
        }

        $display = $this->app->call($this->getDisplay(), ['payload' => $payload]);

        if ($display instanceof DisplayDatatablesAsync) {
            $display->setPayload($payload);
        }

        if ($display instanceof DisplayInterface) {
            $display->setModelClass($this->getClass());
        }

        if ($display instanceof Initializable) {
            $display->initialize();
        }

        return $display;
    }

    /**
     * @return Closure|null
     */
    public function getCreate()
    {
        return $this->create;
    }

    /**
     * @param  Closure|null  $callback
     * @return $this
     */
    public function onCreate(Closure $callback = null)
    {
        $this->create = $callback;

        return $this;
    }

    /**
     * @param  mixed  $payload
     * @return mixed|void
     */
    public function fireCreate($payload = [])
    {
        if (! is_callable($this->getCreate())) {
            return;
        }

        $form = $this->app->call($this->getCreate(), ['payload' => $payload]);

        if ($form instanceof DisplayInterface) {
            $form->setModelClass($this->getClass());
        }

        if ($form instanceof FormInterface) {
            $form->setAction($this->getStoreUrl());
        }

        if ($form instanceof Initializable) {
            $form->initialize();
        }

        return $form;
    }

    /**
     * @return Closure|null
     */
    public function getEdit()
    {
        return $this->edit;
    }

    /**
     * @param  Closure|null  $callback
     * @return $this
     */
    public function onEdit(Closure $callback = null)
    {
        $this->edit = $callback;

        return $this;
    }

    /**
     * @param  int|string  $id
     * @param  mixed  $payload
     * @return mixed|void
     */
    public function fireEdit($id, $payload = [])
    {
        if (! is_callable($this->getEdit())) {
            return;
        }

        $payload = array_merge(['id' => $id], ['payload' => $payload]);

        $form = $this->app->call($this->getEdit(), $payload);

        if ($form instanceof DisplayInterface) {
            $form->setModelClass($this->getClass());
        }

        if ($form instanceof FormInterface) {
            $form->setAction($this->getUpdateUrl($id));
        }

        if ($form instanceof Initializable) {
            $form->initialize();
        }

        if ($form instanceof FormInterface) {
            $form->setId($id);
        }

        return $form;
    }

    /**
     * @param  Closure|null  $callback
     * @return $this
     */
    public function onCreateAndEdit(Closure $callback = null)
    {
        $this->onCreate($callback);
        $this->onEdit($callback);

        return $this;
    }

    /**
     * @return Closure|null
     */
    public function getDelete()
    {
        return $this->delete;
    }

    /**
     * @param  Closure|null  $callback
     * @return $this
     */
    public function onDelete(Closure $callback = null)
    {
        $this->delete = $callback;

        return $this;
    }

    /**
     * @param  int|string  $id
     * @return mixed
     */
    public function fireDelete($id)
    {
        if (is_callable($this->getDelete())) {
            return $this->app->call($this->getDelete(), [$id]);
        }
    }

    /**
     * @return Closure|null
     */
    public function getDestroy()
    {
        return $this->destroy;
    }

    /**
     * @param  Closure|null  $callback
     * @return $this
     */
    public function onDestroy(Closure $callback = null)
    {
        $this->destroy = $callback;

        return $this;
    }

    /**
     * @param  int|string  $id
     * @return mixed
     */
    public function fireDestroy($id)
    {
        if (is_callable($this->getDestroy())) {
            return $this->app->call($this->getDestroy(), [$id]);
        }
    }

    /**
     * @return Closure|null
     */
    public function getRestore()
    {
        return $this->restore;
    }

    /**
     * @param  Closure|null  $callback
     * @return $this
     */
    public function onRestore(Closure $callback = null)
    {
        $this->restore = $callback;

        return $this;
    }

    /**
     * @param  int|string  $id
     * @return bool|mixed
     */
    public function fireRestore($id)
    {
        if (is_callable($this->getRestore())) {
            return $this->app->call($this->getRestore(), [$id]);
        }
    }

    /**
     * @return string
     */
    public function getMessageOnCreate()
    {
        if (is_null($this->messageOnCreate)) {
            $this->messageOnCreate = parent::getMessageOnCreate();
        }

        return $this->messageOnCreate;
    }

    /**
     * @param  string  $messageOnCreate
     * @return $this
     */
    public function setMessageOnCreate($messageOnCreate)
    {
        $this->messageOnCreate = $messageOnCreate;

        return $this;
    }

    /**
     * @return string
     */
    public function getMessageOnUpdate()
    {
        if (is_null($this->messageOnUpdate)) {
            $this->messageOnUpdate = parent::getMessageOnUpdate();
        }

        return $this->messageOnUpdate;
    }

    /**
     * @param  string  $messageOnUpdate
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
            $this->messageOnDelete = parent::getMessageOnDelete();
        }

        return $this->messageOnDelete;
    }

    /**
     * @param  string  $messageOnDelete
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
    public function getMessageOnDestroy()
    {
        if (is_null($this->messageOnDestroy)) {
            $this->messageOnDestroy = parent::getMessageOnDestroy();
        }

        return $this->messageOnDestroy;
    }

    /**
     * @param  string  $messageOnDestroy
     * @return $this
     */
    public function setMessageOnDestroy($messageOnDestroy)
    {
        $this->messageOnDestroy = $messageOnDestroy;

        return $this;
    }

    /**
     * @return string
     */
    public function getMessageOnRestore()
    {
        if (is_null($this->messageOnRestore)) {
            $this->messageOnRestore = parent::getMessageOnRestore();
        }

        return $this->messageOnRestore;
    }

    /**
     * @param  string  $messageOnRestore
     * @return $this
     */
    public function setMessageOnRestore($messageOnRestore)
    {
        $this->messageOnRestore = $messageOnRestore;

        return $this;
    }
}
