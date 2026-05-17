<?php

use SleepingOwl\Admin\Navigation\Page;
use Illuminate\Support\Facades\Config;

class PageTest extends TestCase
{
    /**
     * @return Page
     */
    protected function getPage()
    {
        return new Page();
    }

    public function test_url_resolution_string()
    {
        $page = $this->getPage();
        $page->setUrl('admin/test');

        // Assuming url() helper works in tests
        $this->assertEquals(url('admin/test'), $page->getUrl());
    }

    public function test_url_resolution_closure()
    {
        $page = $this->getPage();
        $page->setUrl(function () {
            return 'https://custom-url.com';
        });

        $this->assertEquals('https://custom-url.com', $page->getUrl());
    }

    public function test_url_resolution_full_string()
    {
        $page = $this->getPage();
        $page->setUrl('http://external.com');

        $this->assertEquals('http://external.com', $page->getUrl());
    }

    public function test_title_resolution_closure()
    {
        $page = $this->getPage();
        $page->setTitle(function () {
            return 'Closure Title';
        });

        $this->assertEquals('Closure Title', $page->getTitle());
    }

    public function test_icon_resolution_closure()
    {
        $page = $this->getPage();
        $page->setIcon(function () {
            return 'fa-user';
        });

        $this->assertEquals('<i class="fa-user"></i>', $page->getIcon());
    }

    public function test_priority_resolution_closure()
    {
        $page = $this->getPage();
        $page->setPriority(function () {
            return 500;
        });

        $this->assertEquals(500, $page->getPriority());
    }

    public function test_target_resolution_closure()
    {
        $page = $this->getPage();
        $page->setTarget(function () {
            return '_blank';
        });

        $this->assertEquals('_blank', $page->getTarget());
    }

    public function test_active_resolution_closure()
    {
        $page = $this->getPage();
        $page->setIsActive(function () {
            return true;
        });

        $this->assertTrue($page->isActive());

        $page->setIsActive(function () {
            return false;
        });

        $this->assertFalse($page->isActive());
    }

    public function test_fixes_http_to_https_when_app_url_is_https()
    {
        Config::set('app.url', 'https://domain.com');
        
        $page = new Page();
        $page->setUrl('http://domain.com/admin/test');

        $this->assertEquals('https://domain.com/admin/test', $page->getUrl());
    }

    public function test_does_not_fix_http_when_app_url_is_http()
    {
        Config::set('app.url', 'http://domain.com');
        
        $page = new Page();
        $page->setUrl('http://domain.com/admin/test');

        $this->assertEquals('http://domain.com/admin/test', $page->getUrl());
    }

    public function test_fixes_relative_url_when_app_url_is_https()
    {
        Config::set('app.url', 'https://domain.com');
        
        $page = new Page();
        $page->setUrl('admin/test');

        $url = $page->getUrl();
        $this->assertStringStartsWith('https://', $url);
    }
}
