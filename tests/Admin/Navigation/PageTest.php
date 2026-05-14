<?php

use SleepingOwl\Admin\Navigation\Page;

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
}
