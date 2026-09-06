<?php

use Illuminate\Config\Repository;
use SleepingOwl\Admin\Assets\AssetProfileSelector;

class AssetProfileSelectorTest extends TestCase
{
    public function test_it_maps_the_existing_dev_assets_flag_to_a_complete_profile(): void
    {
        $config = new Repository(['sleeping_owl' => ['dev_assets' => false]]);
        $selector = new AssetProfileSelector($config);

        $this->assertSame('production', $selector->selected());

        $config->set('sleeping_owl.dev_assets', true);
        $this->assertSame('development', $selector->selected());
    }
}
