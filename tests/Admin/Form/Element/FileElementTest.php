<?php

use SleepingOwl\Admin\Form\Element\File;

class FileElementWithLimit extends File
{
    public function getMaxFileSize(): int
    {
        return 12;
    }
}

class FileElementTest extends TestCase
{
    public function test_view_data_contains_the_resolved_upload_limit(): void
    {
        $this->app['request']->session()->shouldReceive('getOldInput')->andReturnNull();
        $element = new FileElementWithLimit('document', 'Document');

        $this->assertSame(12.0, $element->toArray()['max_file_size']);
    }
}
