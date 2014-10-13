<?php

use SleepingOwl\Admin\Session\QueryState;

class QueryStateTest extends \PHPUnit_Framework_TestCase
{
	/** @test */
	public function it_saves_and_loads_query_state()
	{
		$request = Mockery::mock('Illuminate\Http\Request');
		$request->shouldReceive('query')->once()->andReturn(['name' => 'value']);

		$session = Mockery::mock('Illuminate\Session\Store');
		$session->shouldReceive('set')->with('model_name.index.query', ['name' => 'value'])->once();
		$session->shouldReceive('get')->with('model_name.index.query')->once()->andReturn(['name' => 'value']);


		$queryState = new QueryState($session, $request);
		$queryState->setPrefix('model_name');
		$queryState->save();
		$state = $queryState->load();
		$this->assertEquals(['name' => 'value'], $state);
	}
}
 