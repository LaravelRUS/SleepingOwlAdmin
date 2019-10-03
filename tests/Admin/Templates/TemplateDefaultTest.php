<?php

use Mockery as m;
use SleepingOwl\Admin\Templates\TemplateDefault;

class TemplateDefaultTest extends TestCase
{
    public function tearDown(): void
    {
        m::close();
    }

    /**
     * @return SleepingOwl\Admin\Templates\TemplateDefault
     */
    protected function getTemplate()
    {
        return $this->app->make(TemplateDefault::class);
    }

    /**
     * @covers SleepingOwl\Admin\Templates\TemplateDefault::getViewNamespace
     */
    public function test_getViewNamespace()
    {
        $this->assertEquals('sleeping_owl::default', $this->getTemplate()->getViewNamespace());
    }

    /**
     * @covers SleepingOwl\Admin\Templates\TemplateDefault::getViewPath
     */
    public function test_getViewPath()
    {
        $this->assertEquals('sleeping_owl::default.test', $this->getTemplate()->getViewPath('test'));

        $view = m::mock(\Illuminate\View\View::class);
        $view->shouldReceive('getPath')->once()->andReturn('custom.template');
        $this->assertEquals('custom.template', $this->getTemplate()->getViewPath($view));
    }

    /**
     * @covers SleepingOwl\Admin\Templates\TemplateDefault::view
     * @covers SleepingOwl\Admin\Templates\TemplateDefault::getViewPath
     */
    public function test_view()
    {
        $template = $this->getTemplate();
        $this->getViewMock()->shouldReceive('make')->once()->withArgs([
            'sleeping_owl::default.test', ['test', 'template' => $template], [],
        ])->andReturn('html');

        $this->assertEquals('html', $template->view(
            'test', ['test']
        ));

        $this->tearDown();

        $template = $this->getTemplate();
        $view = m::mock(\Illuminate\View\View::class);

        $view->shouldReceive('with')->with(['test', 'template' => $template])->once()->andReturnSelf();

        $this->assertEquals($view, $template->view($view, ['test']));
    }

    /**
     * @covers SleepingOwl\Admin\Templates\TemplateDefault::getTitle
     */
    public function test_getTitle()
    {
        $this->getConfigMock()
            ->shouldReceive('get')
            ->with('sleeping_owl.title', null)
            ->once()
            ->andReturn('Hello world');

        $this->assertEquals('Hello world', $this->getTemplate()->getTitle());
    }

    /**
     * @covers SleepingOwl\Admin\Templates\TemplateDefault::makeTitle
     */
    public function test_makeTitle()
    {
        $this->getConfigMock()
            ->shouldReceive('get')
            ->with('sleeping_owl.title', null)
            ->twice()
            ->andReturn('Hello world');

        $this->assertEquals('Hello world', $this->getTemplate()->makeTitle(''));
        $this->assertEquals('Hello world', $this->getTemplate()->makeTitle(null));

        // -----------

        $this->getConfigMock()
            ->shouldReceive('get')
            ->with('sleeping_owl.title', null)
            ->once()
            ->andReturn('Hello world');

        $this->assertEquals('Title | Hello world', $this->getTemplate()->makeTitle('Title'));

        // -----------

        $this->getConfigMock()
            ->shouldReceive('get')
            ->with('sleeping_owl.title', null)
            ->once()
            ->andReturn('Hello world');

        $this->assertEquals('Title -> Hello world', $this->getTemplate()->makeTitle('Title', ' -> '));
    }

    /**
     * @covers SleepingOwl\Admin\Templates\TemplateDefault::getLogo
     */
    public function test_getLogo()
    {
        $this->getConfigMock()
            ->shouldReceive('get')
            ->with('sleeping_owl.logo', null)
            ->once()
            ->andReturn($logo = '<img src="logo.png" />');

        $this->assertEquals($logo, $this->getTemplate()->getLogo());
    }

    /**
     * @covers SleepingOwl\Admin\Templates\TemplateDefault::getLogoMini
     */
    public function test_getLogoMini()
    {
        $this->getConfigMock()
            ->shouldReceive('get')
            ->with('sleeping_owl.logo_mini', null)
            ->once()
            ->andReturn($logo = '<img src="logo-mini.png" />');

        $this->assertEquals($logo, $this->getTemplate()->getLogoMini());
    }

    /*
     * @covers TemplateDefault::renderBreadcrumbs
     */
    //public function test_renderBreadcrumbs()
    //{
    //    $this->getConfigMock()
    //        ->shouldReceive('get')
    //        ->with('sleeping_owl.breadcrumbs', null)
    //        ->once()
    //        ->andReturn(true);
    //
    //    $this->getBreadcrumbsMock()
    //        ->shouldReceive('renderIfExists')
    //        ->with('test')
    //        ->once()
    //        ->andReturn($return = '<li />');
    //
    //    $this->assertEquals($return, $this->getTemplate()->renderBreadcrumbs('test'));
    //
    //    // -----------
    //
    //    $this->getConfigMock()
    //        ->shouldReceive('get')
    //        ->with('sleeping_owl.breadcrumbs', null)
    //        ->once()
    //        ->andReturn(false);
    //
    //    $this->getBreadcrumbsMock()
    //        ->shouldNotReceive('renderIfExists');
    //
    //    $this->assertNull($this->getTemplate()->renderBreadcrumbs('test'));
    //}
}
