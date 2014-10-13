<?php

use SleepingOwl\RandomFilenamer\RandomFilenamer;

class RandomFilenamerTest extends \PHPUnit_Framework_TestCase
{
	/** @test */
	public function it_generates_name_with_extension()
	{
		$name = RandomFilenamer::get('', 'jpg');
		$this->assertStringEndsWith('.jpg', $name);
	}

}
