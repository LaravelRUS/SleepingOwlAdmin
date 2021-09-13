<?php

use Mockery as m;

class ColumnCustomTest extends TestCase
{
    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @param  string|null  $label
     * @return \SleepingOwl\Admin\Display\Column\Custom
     */
    protected function getColumn($label = null)
    {
        return new \SleepingOwl\Admin\Display\Column\Custom($label);
    }

    public function test_view_path()
    {
        $column = $this->getColumn();

        $this->assertEquals('column.custom', $column->getView());
    }

    public function test_gets_or_sets_callback()
    {
        $column = $this->getColumn();

        $this->assertEquals($column, $column->setCallback($callback = function () {
        }));

        $this->assertEquals($callback, $column->getCallback());
    }

    public function test_gets_model_value()
    {
        $column = $this->getColumn();

        $column->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));
        $model->shouldReceive('init')->once();

        $column->setCallback(function ($model) {
            $model->init();

            return 'value';
        });

        $this->assertEquals('value', $column->getModelValue());
    }

    public function test_gets_model_value_exception()
    {
        $this->expectException(\Exception::class);
        $column = $this->getColumn();

        $this->assertEquals('value', $column->getModelValue());
    }

    public function test_to_array()
    {
        $column = $this->getColumn();

        $column->setCallback(function () {
        });

        $this->assertTrue(array_key_exists('value', $column->toArray()));
    }
}
