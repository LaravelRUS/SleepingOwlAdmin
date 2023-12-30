<?php

namespace SleepingOwl\Tests\Helpers;

use Mockery as m;
use SleepingOwl\Admin\Contracts\Form\FormButtonsInterface;
use SleepingOwl\Admin\Contracts\ModelConfigurationInterface;
use SleepingOwl\Admin\Contracts\Repositories\RepositoryInterface;

trait FormHelpers
{
    /**
     * @param  string  $class
     * @return m\MockInterface
     */
    public function makeMockForFormElement($class)
    {
        $element = m::mock($class);

        $element->shouldReceive('setModel')->once();
        $element->shouldReceive('initialize')->once();

        return $element;
    }

    /**
     * @param  array  $elements
     * @return mixed
     */
    public function makeFormDefault(array $elements = [])
    {
        $this->app->instance(
            RepositoryInterface::class,
            $repository = m::mock(RepositoryInterface::class)
        );

        $repository->shouldReceive('setClass')->once();

        $this->app->instance(FormButtonsInterface::class, $buttons = m::mock(FormButtonsInterface::class));
        $buttons->shouldReceive('setModel')->once();
        $buttons->shouldReceive('setModelConfiguration')->once();

        $class = FormDefaultTestMockModel::class;

        $this->getSleepingOwlMock()
            ->shouldReceive('getModel')
            ->once()->with($class)
            ->andReturn(m::mock(ModelConfigurationInterface::class));

        $form = $this->getFormElement($elements);

        $form->setModelClass($class);

        return $form;
    }
}

class FormDefaultTestMockModel extends \Illuminate\Database\Eloquent\Model
{
}
