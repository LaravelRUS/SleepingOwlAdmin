<?php

use Mockery as m;
use SleepingOwl\Admin\Form\Element\NamedFormElement;

class NamedFormElementTest extends TestCase
{
    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @param  string  $path
     * @param  null  $label
     * @return \PHPUnit\Framework\MockObject\MockObject
     *
     * @throws ReflectionException
     */
    protected function getElement($path = 'path', $label = null)
    {
        return $this->getMockForAbstractClass(NamedFormElement::class, [
            $path,
            $label,
        ]);
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::__construct
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::getLabel
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::setLabel
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::getPath
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::setPath
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::getName
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::setName
     */
    public function test_constructor()
    {
        $element = $this->getElement($path = 'path.test.test1.tets2', $label = 'Label');

        $this->assertEquals($label, $element->getLabel());
        $this->assertEquals($path, $element->getPath());
        $this->assertEquals('path[test][test1][tets2]', $element->getName());
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::__construct
     */
    public function test_constructor_exception()
    {
        $this->expectException(\SleepingOwl\Admin\Exceptions\Form\FormElementException::class);
        $this->getElement(null);
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::getModelAttributeKey
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::setModelAttributeKey
     */
    public function test_gets_and_sets_attribute()
    {
        $element = $this->getElement();

        $element->setModelAttributeKey('test');
        $this->assertEquals('test', $element->getModelAttributeKey());
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::setDefaultValue
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::getDefaultValue
     */
    public function test_gets_and_sets_default_value()
    {
        $element = $this->getElement();

        $element->setDefaultValue('test');
        $this->assertEquals('test', $element->getDefaultValue());
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::setHelpText
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::getHelpText
     */
    public function test_gets_and_sets_help_text()
    {
        $element = $this->getElement();

        $element->setHelpText('test');
        $this->assertEquals('test', $element->getHelpText());

        $helpText = m::mock(\Illuminate\Contracts\Support\Htmlable::class);
        $helpText->shouldReceive('toHtml')->once()->andReturn('html');

        $element->setHelpText($helpText);
        $this->assertEquals('html', $element->getHelpText());
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::required
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::getValidationRules
     */
    public function test_add_required_rule()
    {
        $element = $this->getElement('key');

        $element->required();
        $this->assertEquals(['key' => ['required']], $element->getValidationRules());
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::required
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::getValidationMessages
     */
    public function test_add_required_rule_with_message()
    {
        $element = $this->getElement('key');

        $element->required('required field');

        $this->assertEquals(['key.required' => 'required field'], $element->getValidationMessages());
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::required
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::getValidationRules
     */
    public function test_add_unique_rule()
    {
        $element = $this->getElement('key');

        $model = m::mock(\Illuminate\Database\Eloquent\Model::class);
        $element->setModel($model);

        $model->shouldReceive('getTable')->once()->andReturn('test_table');
        $model->shouldReceive('getConnectionName')->once()->andReturn('connection');
        $model->shouldReceive('getKeyName')->once()->andReturn('id');

        $element->unique();
        $this->assertEquals(['key' => ['unique:connection.test_table,key,null,id']], $element->getValidationRules());
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::unique
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::getValidationMessages
     */
    public function test_add_unique_rule_with_message()
    {
        $element = $this->getElement('key');

        $element->unique('must be unique');
        $this->assertEquals(['key.unique' => 'must be unique'], $element->getValidationMessages());
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::addValidationMessage
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::getValidationMessages
     */
    public function test_gets_validation_messages()
    {
        $element = $this->getElement('key');

        $element->addValidationMessage('test', 'test message');
        $element->addValidationMessage('hello', 'hello message');
        $this->assertEquals([
            'key.test'  => 'test message',
            'key.hello' => 'hello message',
        ], $element->getValidationMessages());
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::getValidationLabels
     */
    public function test_gets_validation_labels()
    {
        $element = $this->getElement('key.subkey', 'Label');

        $this->assertEquals(['key.subkey' => 'Label'], $element->getValidationLabels());
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::getValueFromRequest
     */
    public function test_gets_session_value_from_request()
    {
        $request = $this->app['request'];
        $session = $request->getSession();

        $element = $this->getElement('key.subkey', 'Label');
        $session->shouldReceive('getOldInput')->andReturn('test');

        $this->assertEquals('test', $element->getValueFromRequest($request));
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::getValueFromRequest
     */
    public function test_gets_value_from_request()
    {
        /** @var \Illuminate\Http\Request $request */
        $request = $this->app['request'];
        $request->offsetSet('key', [
            'subkey1' => 'hello world',
        ]);

        $session = $request->getSession();

        $element = $this->getElement('key.subkey1', 'Label');
        $session->shouldReceive('getOldInput')->andReturn(null);
        $this->assertEquals('hello world', $element->getValueFromRequest($request));
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::getValue
     */
    public function test_gets_value_with_request()
    {
        $request = $this->app['request'];

        $session = $request->getSession();
        $session->shouldReceive('getOldInput')->andReturn(null);

        $element = $this->getElement('key.subkey', 'Label');
        $request->offsetSet('key', [
            'subkey' => 'hello world',
        ]);

        $this->assertEquals('hello world', $element->getValueFromModel());
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::getValue
     */
    public function test_gets_value()
    {
        $request = $this->app['request'];
        $session = $request->getSession();
        $session->shouldReceive('getOldInput')->andReturn(null);

        $element = $this->getElement('key', 'Label');

        $this->assertNull($element->getValueFromModel());

        $element->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));
        $model->shouldReceive('getAttribute')->with('key')->andReturn('value');

        $this->assertNull($element->getValue());

        $model->exists = true;
        $this->assertEquals('value', $element->getValueFromModel());
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::resolvePath
     */
    public function test_resolving_path()
    {
        $element = $this->getElement('key', 'Label');
        $element->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));

        $this->assertEquals($model, $element->resolvePath());

        // -------------

        $element = $this->getElement('key.subkey', 'Label');
        $element->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));
        $model->exists = true;

        $model->shouldReceive('getAttribute')
            ->andReturn($subModel = m::mock(\Illuminate\Database\Eloquent\Model::class));

        $this->assertEquals($subModel, $element->resolvePath());

        // -------------

        $element = $this->getElement('key.subkey', 'Label');
        $element->setModel($model = new NamedFormElementTestModuleForTestingResolvePath());

        $this->assertInstanceOf(NamedFormElementTestModuleForTestingResolvePathBelongsTo::class, $element->resolvePath());

        // -------------

        $element = $this->getElement('key1.subkey', 'Label');
        $element->setModel($model = new NamedFormElementTestModuleForTestingResolvePath());

        $this->assertInstanceOf(NamedFormElementTestModuleForTestingResolvePathHasOne::class, $element->resolvePath());

        // -------------

        $element = $this->getElement('key2.subkey', 'Label');
        $element->setModel($model = new NamedFormElementTestModuleForTestingResolvePath());

        $this->assertInstanceOf(NamedFormElementTestModuleForTestingResolvePathHasMany::class, $element->resolvePath());
    }

    /**
     * @covers SleepingOwl\Admin\Form\Element\NamedFormElement::toArray
     */
    public function test_gets_array()
    {
        $element = $this->getElement('key2.subkey', 'Label');

        $request = $this->app['request'];
        $session = $request->getSession();
        $session->shouldReceive('getOldInput')->andReturn(null);

        $this->assertEquals([
            'value'           => null,
            'readonly'        => false,
            'model'           => null,
            'id'              => 'key2__subkey',
            'name'            => 'key2[subkey]',
            'path'            => 'key2.subkey',
            'label'           => 'Label',
            'helpText'        => null,
            'required'        => false,
            'attributes'      => ' id="key2__subkey" name="key2[subkey]"',
            'class'           => null,
            'style'           => null,
            'visibled'        => true,
            'attributesArray' => ['id' => 'key2__subkey', 'name' => 'key2[subkey]'],
        ], $element->toArray());
    }

    /**
     * @covers SleepingOwl\Admin\Form\FormElement::isValueSkipped()
     * @covers SleepingOwl\Admin\Form\FormElement::setValueSkipped()
     */
    public function test_does_not_set_skipped_values()
    {
        $nameElement = $this->getElement('name', 'Name');
        $passwordElement = $this->getElement('password', 'Password')->setValueSkipped(true);

        $model = new NamedFormElementTestModuleForTestingSkippedValues();
        foreach ([$nameElement, $passwordElement] as $element) {
            /* @var $element NamedFormElement */
            $element->setModel($model);
            $element->setModelAttribute($element->getLabel());
        }

        $attributes = array_keys($model->getAttributes());
        $this->assertFalse(in_array('password', $attributes, true));
        $this->assertCount(1, $attributes);
    }

    public function test_prepare_value()
    {
        $element = $this->getElement('key', 'Label');
        $value = 'value';

        $this->assertEquals($value, $element->prepareValue($value));

        $element->mutateValue(function ($value) {
            return strtoupper($value);
        });

        $this->assertEquals('VALUE', $element->prepareValue($value));
    }

    public function test_mutator()
    {
        $element = $this->getElement('key', 'Label');
        $this->assertFalse($element->hasMutator());

        $element->mutateValue(function ($value) {
            return strtoupper($value);
        });
        $this->assertTrue($element->hasMutator());
    }

    public function test_get_model_by_path()
    {
        $element = $this->getElement('key', 'Label');

        $element->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));

        $this->assertEquals($model, $this->callMethodByPath($element, 'key'));

        $element->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));
        $model->shouldReceive('getAttribute')->with('key')->andReturn('test');

        $this->assertNull($this->callMethodByPath($element, 'key.key1'));

        $element->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));
        $model->shouldReceive('getAttribute')
            ->with('key')
            ->andReturn($model1 = m::mock(\Illuminate\Database\Eloquent\Model::class));

        $this->assertEquals($model1, $this->callMethodByPath($element, 'key.key1'));
    }

    public function test_get_model_by_path_exception()
    {
        $this->expectException(LogicException::class);
        $element = $this->getElement('key', 'Label');

        $element->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));
        $model->shouldReceive('getAttribute')
            ->with('key')
            ->andReturn($model1 = m::mock(\Illuminate\Database\Eloquent\Model::class));

        $model1->shouldReceive('getAttribute')->with('key1');

        $this->callMethodByPath($element, 'key.key1.title');
    }

    /**
     * @param  NamedFormElement  $element
     * @param  $path
     * @return mixed
     *
     * @throws ReflectionException
     */
    protected function callMethodByPath(NamedFormElement $element, $path)
    {
        $reflection = new ReflectionClass($element);

        $method = $reflection->getMethod('getModelByPath');
        $method->setAccessible(true);

        return $method->invoke($element, $path);
    }
}

class NamedFormElementTestModuleForTestingResolvePath extends \Illuminate\Database\Eloquent\Model
{
    public function key()
    {
        return $this->hasOne(NamedFormElementTestModuleForTestingResolvePathBelongsTo::class);
    }

    public function key1()
    {
        return $this->hasOne(NamedFormElementTestModuleForTestingResolvePathHasOne::class);
    }

    public function key2()
    {
        return $this->hasMany(NamedFormElementTestModuleForTestingResolvePathHasMany::class);
    }
}

class NamedFormElementTestModuleForTestingResolvePathBelongsTo extends \Illuminate\Database\Eloquent\Model
{
}

class NamedFormElementTestModuleForTestingResolvePathHasOne extends \Illuminate\Database\Eloquent\Model
{
}

class NamedFormElementTestModuleForTestingResolvePathHasMany extends \Illuminate\Database\Eloquent\Model
{
}

class NamedFormElementTestModuleForTestingSkippedValues extends \Illuminate\Database\Eloquent\Model
{
}
