<?php

namespace SleepingOwl\Admin\Model;

use Closure;
use Illuminate\Support\Str;
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
     * @return DisplayInterface|mixed
     */
    public function fireDisplay()
    {
        if (! is_callable($this->display)) {
            return;
        }

        $display = app()->call($this->display);
        if ($display instanceof DisplayInterface) {
            $display->setClass($this->getClass());
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
            $create->setClass($this->getClass());
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
            $edit->setClass($this->getClass());
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
        if (is_callable($this->delete)) {
            return app()->call($this->delete, [$id]);
        }
    }

    /**
     * @param $id
     *
     * @return bool|mixed
     */
    public function fireRestore($id)
    {
        if (is_callable($this->restore)) {
            return app()->call($this->restore, [$id]);
        }

        return $this->restore;
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

    protected function setDefaultAlias()
    {
        $alias = Str::snake(Str::plural(class_basename($this->getClass())));
        $this->setAlias($alias);
    }
}
