<?php

use SleepingOwl\Admin\Assets\AssetManifest;

class AssetManifestTest extends TestCase
{
    public function test_it_exposes_validated_profiles_and_logical_bundles(): void
    {
        $manifest = AssetManifest::fromArray($this->manifest());
        $profile = $manifest->profile('production');
        $core = $profile->bundle('core');

        $this->assertSame(1, $manifest->schemaVersion());
        $this->assertSame('12.0.0', $manifest->packageVersion());
        $this->assertSame(['production'], $manifest->profileIds());
        $this->assertSame(['core', 'feature:forms'], $profile->entryIds());
        $this->assertSame('js/admin-core.js', $core->scripts()[0]->file());
        $this->assertSame(str_repeat('a', 32), $core->scripts()[0]->version());
        $this->assertSame('css/admin-core.css', $core->styles()[0]->file());
    }

    public function test_it_rejects_unsupported_schema_and_missing_core(): void
    {
        foreach ([$this->withSchema(2), $this->withoutCore()] as $manifest) {
            try {
                AssetManifest::fromArray($manifest);
                $this->fail('Invalid manifest was accepted.');
            } catch (InvalidArgumentException $exception) {
                $this->assertNotSame('', $exception->getMessage());
            }
        }
    }

    public function test_fragment_profiles_do_not_require_a_core_entry(): void
    {
        $fragment = $this->manifest();
        unset($fragment['profiles']['production']['entries']['core']);

        $manifest = AssetManifest::fromFragment($fragment);

        $this->assertSame(
            ['feature:forms'],
            $manifest->profile('production')->entryIds()
        );
    }

    public function test_fragment_profiles_cannot_be_empty(): void
    {
        $fragment = $this->manifest();
        $fragment['profiles']['production']['entries'] = [];

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Manifest fragment profile must contain entries.');

        AssetManifest::fromFragment($fragment);
    }

    public function test_it_rejects_unsafe_or_mistyped_asset_paths(): void
    {
        foreach (['../admin-core.js', '/js/admin-core.js', 'https://example.test/app.js', 'js/app.css'] as $file) {
            $manifest = $this->manifest();
            $manifest['profiles']['production']['entries']['core']['scripts'][0]['file'] = $file;

            try {
                AssetManifest::fromArray($manifest);
                $this->fail("Unsafe manifest path [{$file}] was accepted.");
            } catch (InvalidArgumentException $exception) {
                $this->assertStringContainsString('Manifest asset', $exception->getMessage());
            }
        }
    }

    private function withSchema(int $schema): array
    {
        $manifest = $this->manifest();
        $manifest['schema_version'] = $schema;

        return $manifest;
    }

    private function withoutCore(): array
    {
        $manifest = $this->manifest();
        unset($manifest['profiles']['production']['entries']['core']);

        return $manifest;
    }

    private function manifest(): array
    {
        return [
            'schema_version' => 1,
            'package_version' => '12.0.0',
            'build_id' => 'sha256:'.str_repeat('b', 64),
            'profiles' => [
                'production' => [
                    'entries' => [
                        'core' => $this->bundle('admin-core'),
                        'feature:forms' => $this->bundle('features/forms'),
                    ],
                ],
            ],
        ];
    }

    private function bundle(string $name): array
    {
        return [
            'scripts' => [$this->asset("js/{$name}.js", 'a')],
            'styles' => [$this->asset("css/{$name}.css", 'c')],
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
