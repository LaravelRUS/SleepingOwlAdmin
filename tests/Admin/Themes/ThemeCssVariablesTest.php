<?php

use Illuminate\Config\Repository;
use SleepingOwl\Admin\Themes\ThemeConfiguration;
use SleepingOwl\Admin\Themes\ThemeCssVariables;

class ThemeCssVariablesTest extends TestCase
{
    public function test_it_maps_only_the_allowlisted_sidebar_color(): void
    {
        $variables = $this->variables([
            'sidebar_background_color' => ' #102030 ',
            'body_default_class' => 'project-layout',
        ]);

        $this->assertSame([
            '--soa-sidebar-bg' => '#102030',
        ], $variables->all());
    }

    public function test_null_sidebar_color_emits_no_runtime_override(): void
    {
        $this->assertSame([], $this->variables([
            'sidebar_background_color' => null,
        ])->all());
    }

    public function test_invalid_sidebar_color_is_rejected(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('[sleeping_owl.ui.sidebar_background_color]');

        $this->variables([
            'sidebar_background_color' => '#fff; } body { color: red',
        ]);
    }

    private function variables(array $values): ThemeCssVariables
    {
        $configuration = new ThemeConfiguration(new Repository([
            'sleeping_owl' => $values,
        ]));

        return new ThemeCssVariables($configuration);
    }
}
