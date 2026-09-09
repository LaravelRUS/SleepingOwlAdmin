<?php

use SleepingOwl\Admin\Configuration\LegacyConfigNormalizer;

class LegacyConfigNormalizerTest extends TestCase
{
    public function test_legacy_editor_key_fills_the_missing_current_key(): void
    {
        $config = (new LegacyConfigNormalizer())->normalize([
            'show_editor' => true,
        ]);

        $this->assertTrue($config['show_editor']);
        $this->assertTrue($config['env']['enabled']);
    }

    public function test_explicit_current_editor_key_takes_priority(): void
    {
        $config = (new LegacyConfigNormalizer())->normalize([
            'show_editor' => true,
            'env' => ['enabled' => false],
        ]);

        $this->assertFalse($config['env']['enabled']);
    }
}
