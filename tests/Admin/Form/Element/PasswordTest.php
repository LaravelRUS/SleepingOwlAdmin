<?php

namespace SleepingOwl\Tests\Admin\Form\Element;

class PasswordTest extends \TestCase
{
    /**
     * @covers \SleepingOwl\Admin\Form\Element\Password::getValueFromModel()
     *
     * @throws \SleepingOwl\Admin\Exceptions\Form\FormElementException
     */
    public function test_gets_value_from_request()
    {
        $request = $this->app['request'];
        $element = new \SleepingOwl\Admin\Form\Element\Password('password', 'Password');

        $session = $request->session();
        $session->shouldReceive('getOldInput')->andReturn(null);

        $request->offsetSet('password', 'secret');

        $this->assertEquals('secret', $element->getValueFromModel());

        $request->offsetSet('password', null);

        $model = new TestModelForPasswordElement(['password' => 'hashed_password']);
        $element->setModel($model);
        $this->assertEquals(null, $element->getValueFromModel());
    }
}

class TestModelForPasswordElement extends \Illuminate\Database\Eloquent\Model
{
    protected $fillable = ['password'];
}
