<?php

use Mockery as m;
use SleepingOwl\Admin\Form\Element\NamedFormElement;

class NamedFormElementTest extends TestCase
{
    public function tearDown()
    {
        m::close();
    }

    /**
     * @param string $path
     * @param string|null $label
     *
     * @return NamedFormElement
     */
    protected function getElement($path = 'path', $label = null)
    {
        return $this->getMockForAbstractClass(NamedFormElement::class, [
            $path,
            $label,
        ]);
    }

    /**
     * @covers NamedFormElement::__constructor
     * @covers NamedFormElement::getLabel
     * @covers NamedFormElement::setLabel
     * @covers NamedFormElement::getPath
     * @covers NamedFormElement::setPath
     * @covers NamedFormElement::getName
     * @covers NamedFormElement::setName
     */
    public function test_constructor()
    {
        $element = $this->getElement($path = 'path.test.test1.tets2', $label = 'Label');

        $this->assertEquals($label, $element->getLabel());
        $this->assertEquals($path, $element->getPath());
        $this->assertEquals('path[test][test1][tets2]', $element->getName());
    }

    /**
     * @covers NamedFormElement::__constructor
     * @expectedException  \SleepingOwl\Admin\Exceptions\Form\FormElementException
     */
    public function test_constructor_exception()
    {
        $this->getElement(null);
    }

    /**
     * @covers NamedFormElement::setAttribute
     * @covers NamedFormElement::getAttribute
     */
    public function test_gets_and_sets_attribute()
    {
        $element = $this->getElement();

        $element->setModelAttributeKey('test');
        $this->assertEquals('test', $element->getModelAttributeKey());
    }

    /**
     * @covers NamedFormElement::setDefaultValue
     * @covers NamedFormElement::getDefaultValue
     */
    public function test_gets_and_sets_default_value()
    {
        $element = $this->getElement();

        $element->setDefaultValue('test');
        $this->assertEquals('test', $element->getDefaultValue());
    }

    /**
     * @covers NamedFormElement::setHelpText
     * @covers NamedFormElement::getHelpText
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
     * @covers NamedFormElement::required
     * @covers NamedFormElement::getValidationRules
     */
    public function test_add_required_rule()
    {
        $element = $this->getElement('key');

        $element->required();
        $this->assertEquals(['key' => ['required']], $element->getValidationRules());
    }

    /**
     * @covers NamedFormElement::required
     * @covers NamedFormElement::getValidationMessages
     */
    public function test_add_required_rule_with_message()
    {
        $element = $this->getElement('key');

        $element->required('required field');

        $this->assertEquals(['key.required' => 'required field'], $element->getValidationMessages());
    }

    /**
     * @covers NamedFormElement::required
     * @covers NamedFormElement::getValidationRules
     */
    public function test_add_unique_rule()
    {
        $element = $this->getElement('key');

        $model = m::mock(\Illuminate\Database\Eloquent\Model::class);
        $element->setModel($model);

        $model->shouldReceive('getTable')->once()->andReturn('test_table');

        $element->unique();
        $this->assertEquals(['key' => ['unique:test_table,key']], $element->getValidationRules());
    }

    /**
     * @covers NamedFormElement::unique
     * @covers NamedFormElement::getValidationMessages
     */
    public function test_add_unique_rule_with_message()
    {
        $element = $this->getElement('key');

        $element->unique('must be unique');
        $this->assertEquals(['key.unique' => 'must be unique'], $element->getValidationMessages());
    }

    /**
     * @covers NamedFormElement::addValidationMessage
     * @covers NamedFormElement::getValidationMessages
     */
    public function test_gets_validation_messages()
    {
        $element = $this->getElement('key');

        $element->addValidationMessage('test', 'test message');
        $element->addValidationMessage('hello', 'hello message');
        $this->assertEquals(['key.test' => 'test message', 'key.hello' => 'hello message'], $element->getValidationMessages());
    }

    /**
     * @covers NamedFormElement::getValidationLabels
     */
    public function test_gets_validation_labels()
    {
        $element = $this->getElement('key.subkey', 'Label');

        $this->assertEquals(['key.subkey' => 'Label'], $element->getValidationLabels());
    }

    /**
     * @covers NamedFormElement::getValueFromRequest
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
     * @covers NamedFormElement::getValueFromRequest
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
     * @covers NamedFormElement:;getValue
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
     * @covers NamedFormElement:;getValue
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
     * @covers NamedFormElement:;resolvePath
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

        $model->shouldReceive('getAttribute')->andReturn($subModel = m::mock(\Illuminate\Database\Eloquent\Model::class));

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
     * @covers NamedFormElement::toArray
     */
    public function test_gets_array()
    {
        $element = $this->getElement('key2.subkey', 'Label');

        $request = $this->app['request'];
        $session = $request->getSession();
        $session->shouldReceive('getOldInput')->andReturn(null);

        $this->assertEquals([
            'value' => null,
            'readonly' => false,
            'model' => null,
            'id' => 'key2[subkey]',
            'name' => 'key2[subkey]',
            'path' => 'key2.subkey',
            'label' => 'Label',
            'helpText' => null,
            'required' => false,
        ], $element->toArray());
    }

    public function test_save()
    {
        $request = $this->app['request'];

        $session = $request->getSession();
        $session->shouldReceive('getOldInput')->andReturn(null);

        $request->offsetSet($key = 'key', $value = 'hello world');
        $element = $this->getElement($key, 'Label');

        $element->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));
        $model->shouldReceive('setAttribute')->with('key', $value);

        $element->save($request);
    }

    public function test_sets_model_attribute()
    {
        $element = $this->getElement('key', 'Label');
        $value = 'value';

        $element->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));
        $model->shouldReceive('setAttribute')->with('key', $value);

        $element->setModelAttribute($value);
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
        $model->shouldReceive('getAttribute')->with('key')->andReturn(
            $model1 = m::mock(\Illuminate\Database\Eloquent\Model::class)
        );

        $this->assertEquals($model1, $this->callMethodByPath($element, 'key.key1'));
    }

    /**
     * @expectedException LogicException
     */
    public function test_get_model_by_path_exception()
    {
        $element = $this->getElement('key', 'Label');

        $element->setModel($model = m::mock(\Illuminate\Database\Eloquent\Model::class));
        $model->shouldReceive('getAttribute')->with('key')->andReturn(
            $model1 = m::mock(\Illuminate\Database\Eloquent\Model::class)
        );

        $model1->shouldReceive('getAttribute')->with('key1');

        $this->callMethodByPath($element, 'key.key1.title');
    }

    /**
     * @param NamedFormElement $element
     * @param $path
     *
     * @return mixed
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
