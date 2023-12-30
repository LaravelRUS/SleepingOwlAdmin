<?php

namespace SleepingOwl\Admin\Display\Filter;

use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class FilterRelated extends FilterField
{
    /**
     * @var string
     */
    protected $display = 'title';

    /**
     * @var string
     */
    protected $model;

    /**
     * @return string
     */
    public function getDisplay()
    {
        return $this->display;
    }

    /**
     * @param  string  $display
     * @return $this
     */
    public function setDisplay($display)
    {
        $this->display = $display;

        return $this;
    }

    /**
     * @return string
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * @param  string  $model
     * @return $this
     *
     * @throws Exception
     */
    public function setModel($model)
    {
        if (! class_exists($model)) {
            throw new Exception("Class model [$model] not found");
        }

        $this->model = $model;

        return $this;
    }

    /**
     * @return null|string
     *
     * @throws Exception
     */
    public function getTitle()
    {
        if (is_null($parent = parent::getTitle())) {
            return $this->getDisplayField();
        }

        return $parent;
    }

    /**
     * @return null|
     *
     * @throws Exception
     */
    protected function getDisplayField()
    {
        $model = $this->getModel();

        if (is_null($model)) {
            throw new Exception('Specify model for filter: '.$this->getName());
        }

        try {
            $modelObject = app($model)->findOrFail($this->getValue());

            return $modelObject->{$this->getDisplay()};
        } catch (ModelNotFoundException $e) {
            Log::debug('related model instance not found', [
                'model' => $model,
                'id' => $this->getValue(),
            ]);
        }
    }
}
