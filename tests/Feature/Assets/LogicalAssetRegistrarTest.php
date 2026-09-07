<?php

use Illuminate\Contracts\Routing\UrlGenerator;
use Mockery as m;
use SleepingOwl\Admin\Assets\AssetManifest;
use SleepingOwl\Admin\Assets\AssetManifestResolver;
use SleepingOwl\Admin\Assets\LogicalAssetRegistrar;
use SleepingOwl\Admin\Contracts\Template\MetaInterface;

class LogicalAssetRegistrarTest extends TestCase
{
    private array $scripts = [];

    private array $styles = [];

    public function test_it_registers_resolved_assets_in_manifest_order_with_stable_dependencies(): void
    {
        $registrar = new LogicalAssetRegistrar($this->resolver(), $this->recordingMeta());

        $bundle = $registrar->register(['core', 'feature:forms', 'core']);

        $this->assertSame($bundle->scripts(), array_column($this->scripts, 'url'));
        $this->assertSame($bundle->styles(), array_column($this->styles, 'url'));
        $this->assertDependencyChain($this->scripts, 'script');
        $this->assertDependencyChain($this->styles, 'style');
    }

    public function test_handles_do_not_change_with_the_selected_profile_or_content_version(): void
    {
        (new LogicalAssetRegistrar($this->resolver('production'), $this->recordingMeta()))
            ->register(['core']);
        $productionHandles = $this->handles();
        $productionUrls = $this->urls();

        $this->scripts = [];
        $this->styles = [];
        (new LogicalAssetRegistrar($this->resolver('development'), $this->recordingMeta()))
            ->register(['core']);

        $this->assertSame($productionHandles, $this->handles());
        $this->assertNotSame($productionUrls, $this->urls());
    }

    public function test_logical_entries_can_preserve_public_legacy_handles(): void
    {
        $registrar = new LogicalAssetRegistrar($this->resolver(), $this->recordingMeta());

        $registrar->register(
            ['core', 'feature:forms'],
            ['core' => 'admin-default', 'feature:forms' => 'admin-modules-load']
        );

        $this->assertSame(
            ['admin-default', 'admin-modules-load'],
            array_column($this->scripts, 'handle')
        );
        $this->assertSame(
            ['admin-default', 'admin-modules-load'],
            array_column($this->styles, 'handle')
        );
        $this->assertDependencyChain($this->scripts, 'script', true);
        $this->assertDependencyChain($this->styles, 'style', true);
    }

    private function resolver(string $profile = 'production'): AssetManifestResolver
    {
        $url = m::mock(UrlGenerator::class);
        $url->shouldReceive('asset')->andReturnUsing(
            static fn (string $path): string => "https://cdn.example.test/{$path}"
        );

        return new AssetManifestResolver(
            AssetManifest::fromArray($this->manifest()),
            $url,
            'packages/sleepingowl/default',
            $profile
        );
    }

    private function recordingMeta(): MetaInterface
    {
        $meta = m::mock(MetaInterface::class);
        $meta->shouldReceive('addJs')->andReturnUsing(function ($handle, $url, $dependency) use ($meta) {
            $this->scripts[] = compact('handle', 'url', 'dependency');

            return $meta;
        });
        $meta->shouldReceive('addCss')->andReturnUsing(function ($handle, $url, $dependency) use ($meta) {
            $this->styles[] = compact('handle', 'url', 'dependency');

            return $meta;
        });

        return $meta;
    }

    private function assertDependencyChain(array $assets, string $type, bool $aliased = false): void
    {
        foreach ($assets as $index => $asset) {
            if (! $aliased) {
                $this->assertMatchesRegularExpression(
                    "/^sleepingowl-logical-{$type}-[a-f0-9]{16}$/",
                    $asset['handle']
                );
            }
            $this->assertSame($assets[$index - 1]['handle'] ?? null, $asset['dependency']);
        }
    }

    private function handles(): array
    {
        return [
            'scripts' => array_column($this->scripts, 'handle'),
            'styles' => array_column($this->styles, 'handle'),
        ];
    }

    private function urls(): array
    {
        return [
            'scripts' => array_column($this->scripts, 'url'),
            'styles' => array_column($this->styles, 'url'),
        ];
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
                        'core' => $this->bundle('production', 'admin-core', 'a'),
                        'feature:forms' => $this->bundle('production', 'forms', 'b'),
                    ],
                ],
                'development' => [
                    'entries' => [
                        'core' => $this->bundle('development', 'admin-core', 'c'),
                        'feature:forms' => $this->bundle('development', 'forms', 'd'),
                    ],
                ],
            ],
        ];
    }

    private function bundle(string $profile, string $name, string $hash): array
    {
        return [
            'scripts' => [$this->asset("profiles/{$profile}/js/{$name}.js", $hash)],
            'styles' => [$this->asset("profiles/{$profile}/css/{$name}.css", $hash)],
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
