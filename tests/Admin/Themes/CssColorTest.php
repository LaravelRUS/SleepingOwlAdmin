<?php

use SleepingOwl\Admin\Themes\CssColor;

class CssColorTest extends TestCase
{
    public function test_it_accepts_supported_safe_css_colors(): void
    {
        $colors = [
            '#abc',
            '#abcd',
            '#123456',
            '#123456cc',
            'rgb(10, 20, 30)',
            'rgb(10 20 30 / 50%)',
            'hsl(120deg 50% 25%)',
            'black',
            'rebeccapurple',
            'currentColor',
            'transparent',
        ];

        foreach ($colors as $color) {
            $this->assertSame($color, CssColor::from($color)->value());
            $this->assertSame($color, (string) CssColor::from(" {$color} "));
        }
    }

    public function test_it_rejects_unsupported_or_injectable_values(): void
    {
        $colors = [
            null,
            [],
            '',
            '#12',
            '#12345g',
            'rgb(10)',
            'hsl(120 50 25)',
            'var(--project-color)',
            '#123456; color: red',
            'rgb(0 0 0); } body { color: red',
            'url(https://example.test/color)',
        ];

        foreach ($colors as $color) {
            try {
                CssColor::from($color, 'sleeping_owl.ui.sidebar_background_color');
                $this->fail('Invalid color was accepted.');
            } catch (InvalidArgumentException $exception) {
                $this->assertStringContainsString(
                    '[sleeping_owl.ui.sidebar_background_color]',
                    $exception->getMessage()
                );
            }
        }
    }
}
