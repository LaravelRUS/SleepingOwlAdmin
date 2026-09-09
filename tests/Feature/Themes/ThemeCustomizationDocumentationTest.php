<?php

class ThemeCustomizationDocumentationTest extends TestCase
{
    private const COMPONENT_PROPERTIES = [
        '--soa-datatables-autoupdate-color',
        '--soa-inline-editable-max-rows',
    ];

    public function test_documented_properties_match_the_adminlte_runtime_surface(): void
    {
        $root = dirname(__DIR__, 3);
        $documentation = file_get_contents(
            $root.'/docs/modernization/theme-customization.md'
        );

        $expected = array_values(array_unique([
            ...$this->sourceProperties($root),
            ...self::COMPONENT_PROPERTIES,
        ]));
        $documented = $this->properties($documentation);
        sort($expected);
        sort($documented);

        $this->assertSame($expected, $documented);
    }

    public function test_external_theme_documentation_defines_the_shared_ui_boundary(): void
    {
        $documentation = file_get_contents(
            dirname(__DIR__, 3).'/docs/modernization/theme-customization.md'
        );
        $normalized = preg_replace('/\s+/', ' ', $documentation);

        $this->assertStringContainsString(
            "receives SleepingOwl's `shared:ui` exactly once",
            $normalized
        );
        $this->assertStringContainsString(
            'provides token values and genuine presentation differences',
            $normalized
        );
        $this->assertStringContainsString(
            'does not copy or compile either shared semantic layer',
            $normalized
        );
        $this->assertStringContainsString('theme:acme:overrides', $normalized);
    }

    /**
     * @return list<string>
     */
    private function sourceProperties(string $root): array
    {
        $patterns = [
            '/resources/css/core/admin-core.scss',
            '/resources/css/themes/adminlte/_tokens.scss',
            '/resources/css/shared/features/*/*.scss',
            '/resources/css/themes/adminlte/features/*/*.scss',
        ];
        $sources = [];

        foreach ($patterns as $pattern) {
            foreach (glob($root.$pattern) as $path) {
                $sources[] = file_get_contents($path);
            }
        }

        return $this->properties(implode("\n", $sources));
    }

    /**
     * @return list<string>
     */
    private function properties(string $content): array
    {
        preg_match_all('/--soa-[a-z0-9-]+/', $content, $matches);

        return array_values(array_unique($matches[0]));
    }
}
