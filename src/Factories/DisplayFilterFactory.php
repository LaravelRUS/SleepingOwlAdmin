<?php

namespace SleepingOwl\Admin\Factories;

use Illuminate\Contracts\Foundation\Application;
use SleepingOwl\Admin\AliasBinder;
use SleepingOwl\Admin\Contracts\Display\DisplayFilterFactoryInterface;
use SleepingOwl\Admin\Display\Filter;

/**
 * @method Filter\FilterCustom custom($name, string|\Closure|null $title, \Closure $callback)
 * @method Filter\FilterField field($name, string|\Closure|null $title)
 * @method Filter\FilterRelated related($name, string|\Closure|null $title)
 * @method Filter\FilterScope scope($name, string|\Closure|null $title)
 */
class DisplayFilterFactory extends AliasBinder implements DisplayFilterFactoryInterface
{
    /**
     * DisplayFilterFactory constructor.
     *
     * @param  \Illuminate\Contracts\Foundation\Application  $application
     */
    public function __construct(Application $application)
    {
        parent::__construct($application);

        $this->register([
            'field' => Filter\FilterField::class,
            'scope' => Filter\FilterScope::class,
            'custom' => Filter\FilterCustom::class,
            'related' => Filter\FilterRelated::class,
        ]);
    }
}
