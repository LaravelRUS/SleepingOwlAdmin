<?php

namespace SleepingOwl\Admin\View\Components\Form;

use Illuminate\Support\Collection;
use Illuminate\View\Component;
use SleepingOwl\Admin\Facades\Template as AdminTemplate;

class Select extends Component
{
    public string $name;
    public array|Collection $options;
    public ?string $value;
    public array $attributesArray;

    public function __construct($name, $options = [], $value = null, $attributes = [])
    {
        $this->name = $name;
        $this->options = $options;
        $this->value = $value;
        $this->attributesArray = is_array($attributes) ? $attributes : [];
    }

    public function render()
    {
        return AdminTemplate::getViewPath('components.form.select');
    }
}
