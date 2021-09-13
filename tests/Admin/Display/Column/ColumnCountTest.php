<?php

use Mockery as m;

class ColumnCountTest extends TestCase
{
    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @param  string  $name
     * @param  string|null  $label
     * @return \SleepingOwl\Admin\Display\Column\Count
     */
    protected function getColumn($name = 'test_name', $label = null)
    {
        return new \SleepingOwl\Admin\Display\Column\Count($name, $label);
    }

    public function test_view_path()
    {
        $column = $this->getColumn();

        $this->assertEquals('column.count', $column->getView());
    }

    public function test_gets_model_value_string()
    {
        $column = $this->getColumn();

        $column->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));
        $model->shouldReceive('getAttribute')->andReturn('string');

        $this->assertEquals(0, $column->getModelValue());
    }

    public function test_gets_model_value_collection()
    {
        $column = $this->getColumn();

        $column->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));
        $model->shouldReceive('getAttribute')->andReturn(new \Illuminate\Support\Collection([1, 2, 3]));

        $this->assertEquals(3, $column->getModelValue());
    }

    public function test_gets_model_value_array()
    {
        $column = $this->getColumn();

        $column->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));
        $model->shouldReceive('getAttribute')->andReturn([1, 2, 3, 4]);

        $this->assertEquals(4, $column->getModelValue());
    }

    public function test_to_array()
    {
        $column = $this->getColumn();

        $column->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));
        $model->shouldReceive('getAttribute')->andReturn('string');

        $this->assertTrue(array_key_exists('value', $column->toArray()));
    }
}
