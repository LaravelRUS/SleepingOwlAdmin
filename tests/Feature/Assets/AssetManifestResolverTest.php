<?php

use Illuminate\Contracts\Routing\UrlGenerator;
use SleepingOwl\Admin\Assets\AssetManifest;
use SleepingOwl\Admin\Assets\AssetManifestResolver;
use SleepingOwl\Admin\Exceptions\AssetManifestException;

class AssetManifestResolverTest extends TestCase
{
    public function test_it_resolves_ordered_deduplicated_versioned_urls(): void
    {
        $resolver = new AssetManifestResolver(
            AssetManifest::fromArray($this->manifest()),
            $this->urlGenerator(),
            '/packages/sleepingowl/default/'
        );

        $bundle = $resolver->resolveMany(['core', 'feature:forms', 'core']);

        $this->assertSame([
            'https://cdn.example.test/packages/sleepingowl/default/js/admin-core.js?id='.str_repeat('a', 32),
            'https://cdn.example.test/packages/sleepingowl/default/js/forms.js?id='.str_repeat('c', 32),
        ], $bundle->scripts());
        $this->assertSame([
            'https://cdn.example.test/packages/sleepingowl/default/css/admin-core.css?id='.str_repeat('b', 32),
        ], $bundle->styles());
    }

    public function test_unknown_entry_has_an_actionable_diagnostic(): void
    {
        $resolver = new AssetManifestResolver(
            AssetManifest::fromArray($this->manifest()),
            $this->urlGenerator(),
            'packages/sleepingowl/default'
        );

        $this->expectException(AssetManifestException::class);
        $this->expectExceptionMessage('Unknown manifest entry [feature:table]');
        $this->expectExceptionMessage('php artisan sleepingowl:update');

        $resolver->resolve('feature:table');
    }

    private function urlGenerator(): UrlGenerator
    {
        $url = Mockery::mock(UrlGenerator::class);
        $url->shouldReceive('asset')->andReturnUsing(
            static fn (string $path): string => "https://cdn.example.test/{$path}"
        );

        return $url;
    }

    private function manifest(): array
    {
        return [
            'schema_version' => 1,
            'package_version' => '12.0.0',
            'build_id' => 'sha256:'.str_repeat('f', 64),
            'profiles' => [
                'production' => [
                    'entries' => [
                        'core' => [
                            'scripts' => [$this->asset('js/admin-core.js', 'a')],
                            'styles' => [$this->asset('css/admin-core.css', 'b')],
                        ],
                        'feature:forms' => [
                            'scripts' => [$this->asset('js/forms.js', 'c')],
                            'styles' => [],
                        ],
                    ],
                ],
            ],
        ];
    }

    private function asset(string $file, string $hash): array
    {
        return [
            'file' => $file,
            'version' => str_repeat($hash, 32),
            'checksum' => 'sha256:'.str_repeat($hash, 64),
        ];
    }
}
