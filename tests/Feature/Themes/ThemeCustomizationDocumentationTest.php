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

    /**
     * @return list<string>
     */
    private function sourceProperties(string $root): array
    {
        $patterns = [
            '/resources/frontend/core/styles/_custom-properties.scss',
            '/resources/frontend/themes/legacy-adminlte/styles/_custom-properties.scss',
            '/resources/frontend/features/*/styles/_custom-properties.scss',
            '/resources/frontend/features/*/themes/legacy-adminlte/styles/_custom-properties.scss',
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
