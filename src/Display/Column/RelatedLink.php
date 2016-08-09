<?php

namespace SleepingOwl\Admin\Display\Column;

use Illuminate\Database\Eloquent\Model;
use SleepingOwl\Admin\Contracts\Template\TemplateInterface;

class RelatedLink extends Link
{
    /**
     * @var string
     */
    protected $view = 'column.link';

    /**
     * @var string
     */
    protected $originalName;

    /**
     * @param TemplateInterface $template
     * @param \Closure|null|string $name
     * @param null|string $label
     */
    public function __construct(TemplateInterface $template, $name, $label = null)
    {
        parent::__construct($template, $name, $label);
        $this->originalName = $name;
    }

    /**
     * @param Model $model
     *
     * @return $this
     */
    public function setModel(Model $model)
    {
        if (strpos($this->originalName, '.') !== false) {
            $parts = explode('.', $this->originalName);
            $name = array_pop($parts);

            while ($parts) {
                $part = array_shift($parts);
                $relation = $model->getAttribute($part);

                if ($relation instanceof Model) {
                    $model = $relation;
                    $this->setName($name);
                }
            }
        }

        return parent::setModel($model);
    }
}
