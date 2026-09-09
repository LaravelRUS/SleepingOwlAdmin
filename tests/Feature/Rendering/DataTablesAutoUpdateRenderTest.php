<?php

class DataTablesAutoUpdateRenderTest extends TestCase
{
    public function test_view_uses_normalized_auto_update_config(): void
    {
        config()->set([
            'sleeping_owl.datatables_settings.autoupdate' => [
                'enabled' => true,
                'profiles' => [
                    'project-orders' => [
                        'color' => 'black',
                        'interval' => 120,
                    ],
                    'project-stock' => [
                        'color' => '#2563eb',
                        'interval' => 60,
                    ],
                ],
            ],
        ]);

        $html = view('sleeping_owl::features.datatables.autoupdate')->render();

        $this->assertSame(1, preg_match_all('/<span\s+data-admin-table-autoupdate(?:\s|>)/', $html));
        $this->assertSame([
            [
                'class' => 'project-orders',
                'interval' => 120000,
                'color' => 'black',
            ],
            [
                'class' => 'project-stock',
                'interval' => 60000,
                'color' => '#2563eb',
            ],
        ], $this->profilesFrom($html));
        $this->assertStringNotContainsString('data-table-class=', $html);
        $this->assertStringNotContainsString('data-table-classes=', $html);
        $this->assertStringNotContainsString('data-interval=', $html);
        $this->assertStringNotContainsString('--soa-datatables-autoupdate-color', $html);
        $this->assertStringContainsString('<template data-admin-table-autoupdate-control>', $html);
        $this->assertStringContainsString('data-admin-table-autoupdate-bar', $html);
        $this->assertStringContainsString('data-admin-table-autoupdate-toggle', $html);
        $this->assertStringContainsString('class="autoupdater-toggle autoupdater-close"', $html);
        $this->assertStringContainsString('data-admin-table-autoupdate-pause-icon', $html);
        $this->assertStringContainsString('data-admin-table-autoupdate-resume-icon', $html);
        $this->assertStringNotContainsString('<script', $html);
    }

    public function test_disabled_auto_update_renders_no_host_or_template(): void
    {
        config()->set('sleeping_owl.datatables_settings.autoupdate', [
            'enabled' => false,
            'profiles' => [
                'autoupdate' => ['interval' => 300, 'color' => '#dc3545'],
            ],
        ]);

        $html = view('sleeping_owl::features.datatables.autoupdate')->render();

        $this->assertStringNotContainsString('<script', $html);
        $this->assertStringNotContainsString('data-admin-table-autoupdate', $html);
        $this->assertStringNotContainsString('data-admin-table-autoupdate-control', $html);
    }

    private function profilesFrom(string $html): array
    {
        $this->assertSame(1, preg_match('/data-profiles="([^"]+)"/', $html, $matches));

        return json_decode(html_entity_decode($matches[1], ENT_QUOTES), true, flags: JSON_THROW_ON_ERROR);
    }
}
