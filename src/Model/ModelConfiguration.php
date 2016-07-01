<?php

namespace SleepingOwl\Admin\Model;

use Closure;
use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\DisplayInterface;
use SleepingOwl\Admin\Contracts\FormInterface;
use SleepingOwl\Admin\Navigation\Page;

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
     * @return string|\Symfony\Component\Translation\TranslatorInterface
     */
    public function getCreateTitle()
    {
        if (is_null($this->createTitle)) {
            return parent::getCreateTitle();
        }

        return $this->createTitle;
    }

    /**
     * @param string $title
     *
     * @return $this
     */
    public function setCreateTitle($title)
    {
        $this->createTitle = $title;

        return $this;
    }

    /**
     * @return string|\Symfony\Component\Translation\TranslatorInterface
     */
    public function getEditTitle()
    {
        if (is_null($this->editTitle)) {
            return parent::getEditTitle();
        }

        return $this->editTitle;
    }

    /**
     * @param string $title
     *
     * @return $this
     */
    public function setUpdateTitle($title)
    {
        $this->updateTitle = $title;

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
    public function getDestroy()
    {
        return $this->destroy;
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
    public function onDestroy(Closure $callback = null)
    {
        $this->destroy = $callback;

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
     * @param Model $model
     *
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
     * @param Model $model
     *
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
        $this->deletable = false;

        return $this;
    }

    /**
     * @param Model $model
     *
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
     * @param Model $model
     *
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
     * @return mixed
     */
    public function fireDestroy($id)
    {
        if (is_callable($this->getDestroy())) {
            return app()->call($this->getDestroy(), [$id]);
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
     * @return string
     */
    public function getMessageOnCreate()
    {
        if (is_null($this->messageOnUpdate)) {
            $this->messageOnUpdate = parent::getMessageOnCreate();
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
            $this->messageOnUpdate = parent::getMessageOnUpdate();
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
            $this->messageOnDelete = parent::getMessageOnDelete();
        }

        return $this->messageOnDelete;
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
     * @param string $messageOnDestroy
     *
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
     * @param string $controllerClass
     *
     * @return $this
     */
    public function setControllerClass($controllerClass)
    {
        $this->controllerClass = $controllerClass;

        return $this;
    }
}
