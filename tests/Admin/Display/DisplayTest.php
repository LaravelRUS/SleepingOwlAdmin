<?php

use Mockery as m;
use SleepingOwl\Admin\Display\Display;
use SleepingOwl\Admin\Display\Extension\CustomView;

class ConcreteDisplay extends Display
{
    public function getView()
    {
        return 'dummy';
    }
}

class DisplayTest extends TestCase
{
    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @test
     */
    public function test_it_adds_custom_views()
    {
        $display = new ConcreteDisplay();

        $display->addCustomView('my-view', 'before.card', ['foo' => 'bar']);

        $extensions = $display->getExtensions();
        $this->assertCount(7, $extensions); // 6 default + 1 custom view

        $customView = null;
        foreach ($extensions as $extension) {
            if ($extension instanceof CustomView) {
                $customView = $extension;
                break;
            }
        }

        $this->assertNotNull($customView);
        $this->assertEquals('my-view', $customView->getView());
        $this->assertEquals('before.card', $customView->getPlacement());
        $this->assertEquals(['foo' => 'bar'], $customView->toArray());
    }

    /**
     * @test
     */
    public function test_it_adds_custom_view_object()
    {
        $display = new ConcreteDisplay();
        $viewMock = m::mock(\Illuminate\Contracts\View\View::class);

        $display->addCustomView($viewMock, 'before.card');

        $extensions = $display->getExtensions();
        $customView = null;
        foreach ($extensions as $extension) {
            if ($extension instanceof CustomView) {
                $customView = $extension;
                break;
            }
        }

        $this->assertNotNull($customView);
        $this->assertSame($viewMock, $customView->getView());
    }
}
