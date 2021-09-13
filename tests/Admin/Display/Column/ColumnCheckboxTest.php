<?php

use Mockery as m;

class ColumnCheckboxTest extends TestCase
{
    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @param  string|null  $label
     * @return \SleepingOwl\Admin\Display\Column\Checkbox
     */
    protected function getColumn($label = null)
    {
        return new \SleepingOwl\Admin\Display\Column\Checkbox($label);
    }

    public function test_view_path()
    {
        $column = $this->getColumn();

        $this->assertEquals('column.checkbox', $column->getView());
    }

    public function test_gets_model_value()
    {
        $column = $this->getColumn();

        $column->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));
        $model->shouldReceive('getKey')->andReturn('key');

        $this->assertEquals('key', $column->getModelValue());
    }

    // public function test_to_array()
    // {
    //     $column = $this->getColumn();
    //
    //     $column->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));
    //     $model->shouldReceive('getKey')->andReturn('key');
    //
    //     $this->assertTrue(array_key_exists('value', $column->toArray()));
    // }
}
