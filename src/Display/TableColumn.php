<?php

namespace SleepingOwl\Admin\Display;

use Meta;
use Illuminate\Database\Eloquent\Model;
use KodiComponents\Support\HtmlAttributes;
use SleepingOwl\Admin\Model\ModelConfiguration;
use SleepingOwl\Admin\Contracts\ColumnInterface;
use SleepingOwl\Admin\Contracts\Display\TableHeaderColumnInterface;

abstract class TableColumn implements ColumnInterface
{
    use HtmlAttributes;

    /**
     * Column header.
     *
     * @var TableHeaderColumnInterface
     */
    protected $header;

    /**
     * Model instance currently rendering.
     *
     * @var Model
     */
    protected $model;

    /**
     * Column appendant.
     *
     * @var ColumnInterface
     */
    protected $append;

    /**
     * Column width.
     *
     * @var string
     */
    protected $width = null;

    /**
     * @var string
     */
    protected $view;

    /**
     * TableColumn constructor.
     *
     * @param string|null $label
     */
    public function __construct($label = null)
    {
        $this->header = app(TableHeaderColumnInterface::class);

        if (! is_null($label)) {
            $this->setLabel($label);
        }
    }

    /**
     * Initialize column.
     */
    public function initialize()
    {
        Meta::loadPackage(get_called_class());
    }

    /**
     * @return TableHeaderColumnInterface
     */
    public function getHeader()
    {
        return $this->header;
    }

    /**
     * @return int
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * @param string $width
     *
     * @return $this
     */
    public function setWidth($width)
    {
        $this->width = $width;

        return $this;
    }

    /**
     * @return string
     */
    public function getView()
    {
        if (is_null($this->view)) {
            $reflect = new \ReflectionClass($this);
            $this->view = 'column.'.strtolower($reflect->getShortName());
        }

        return $this->view;
    }

    /**
     * @param string $view
     */
    public function setView($view)
    {
        $this->view = $view;
    }

    /**
     * @return ColumnInterface
     */
    public function getAppends()
    {
        return $this->append;
    }

    /**
     * @param ColumnInterface $append
     *
     * @return $this
     */
    public function append(ColumnInterface $append)
    {
        $this->append = $append;

        return $this;
    }

    /**
     * @return Model $model
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model)
    {
        $this->model = $model;
        $append = $this->getAppends();

        if (! is_null($append)) {
            $append->setModel($model);
        }

        return $this;
    }

    /**
     * Get related model configuration.
     * @return ModelConfiguration
     */
    protected function getModelConfiguration()
    {
        return app('sleeping_owl')->getModel(get_class($this->getModel()));
    }

    /**
     * Set column header label.
     *
     * @param string $title
     *
     * @return $this
     */
    public function setLabel($title)
    {
        $this->getHeader()->setTitle($title);

        return $this;
    }

    /**
     * @param bool $orderable
     *
     * @return $this
     */
    public function setOrderable($orderable)
    {
        $this->getHeader()->setOrderable($orderable);

        return $this;
    }

    /**
     * Check if column is orderable.
     * @return bool
     */
    public function isOrderable()
    {
        return $this->getHeader()->isOrderable();
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'attributes' => $this->htmlAttributesToString(),
        ];
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return (string) $this->render();
    }

    /**
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function render()
    {
        return app('sleeping_owl.template')->view(
            $this->getView(),
            $this->toArray()
        );
    }
}
