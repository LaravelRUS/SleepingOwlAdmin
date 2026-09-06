<?php

use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;
use SleepingOwl\Admin\Themes\ThemeAssetManifest;
use SleepingOwl\Admin\Themes\ThemeCapabilities;
use SleepingOwl\Admin\Themes\ThemeCapability;
use SleepingOwl\Admin\Themes\ThemeIcons;

class ThemeMetadataContractTest extends TestCase
{
    public function test_theme_metadata_has_typed_logical_contracts(): void
    {
        $theme = new MetadataContractTheme(
            assets: [
                'feature:table:theme:custom-admin',
                'theme:custom-admin',
                'feature:tabs:theme:custom-admin',
            ],
            icons: ['edit' => 'pencil'],
            capabilities: array_reverse($this->allCapabilityIds())
        );

        $manifest = ThemeAssetManifest::fromTheme($theme);
        $capabilities = ThemeCapabilities::fromTheme($theme);
        $icons = ThemeIcons::fromTheme($theme);

        $this->assertSame('custom-admin', $manifest->themeId());
        $this->assertSame([
            'theme:custom-admin',
            'feature:table:theme:custom-admin',
            'feature:tabs:theme:custom-admin',
        ], $manifest->entries());
        $this->assertSame([
            'theme:custom-admin',
            'feature:tabs:theme:custom-admin',
            'feature:table:theme:custom-admin',
        ], $manifest->entriesFor(['tabs', 'missing', 'tabs', 'table']));
        $this->assertTrue($manifest->hasFeatureAdapter('table'));
        $this->assertSame('feature:table:theme:custom-admin', $manifest->featureEntry('table'));
        $this->assertNull($manifest->featureEntry('modal'));

        $this->assertSame($this->allCapabilityIds(), $capabilities->ids());
        $this->assertTrue($capabilities->supports(ThemeCapability::Tooltip));
        $this->assertTrue($icons->has('edit'));
        $this->assertSame('pencil', $icons->get('edit'));
        $this->assertNull($icons->get('delete'));
    }

    public function test_empty_manifest_supports_the_transitional_legacy_adapter(): void
    {
        $manifest = new ThemeAssetManifest('legacy-template');

        $this->assertSame([], $manifest->entries());
        $this->assertSame([], $manifest->entriesFor(['table']));
    }

    public function test_manifest_rejects_physical_paths(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid theme asset entry [build/theme.css].');

        new ThemeAssetManifest('custom-admin', ['build/theme.css']);
    }

    public function test_manifest_rejects_entries_owned_by_another_theme(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage(
            'Theme asset entry [feature:table:theme:adminlte] belongs to [adminlte], expected [custom-admin].'
        );

        new ThemeAssetManifest('custom-admin', ['feature:table:theme:adminlte']);
    }

    public function test_manifest_rejects_duplicate_entries(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Duplicate theme asset entry [theme:custom-admin].');

        new ThemeAssetManifest('custom-admin', [
            'theme:custom-admin',
            'theme:custom-admin',
        ]);
    }

    public function test_capabilities_reject_unknown_values(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Unknown theme capability [magic-widget].');

        new ThemeCapabilities(['magic-widget']);
    }

    public function test_icon_names_and_tokens_are_validated(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Theme icon [edit] must have a non-empty string token.');

        new ThemeIcons(['edit' => '  ']);
    }

    /**
     * @return list<string>
     */
    private function allCapabilityIds(): array
    {
        return array_map(
            fn (ThemeCapability $capability) => $capability->value,
            ThemeCapability::cases()
        );
    }
}

final class MetadataContractTheme implements ThemeInterface
{
    /**
     * @param  list<string>  $assets
     * @param  array<string, string>  $icons
     * @param  list<string>  $capabilities
     */
    public function __construct(
        private array $assets,
        private array $icons,
        private array $capabilities
    ) {
    }

    public function id(): string
    {
        return 'custom-admin';
    }

    public function viewNamespace(): string
    {
        return 'custom-admin::theme';
    }

    public function assets(): array
    {
        return $this->assets;
    }

    public function icons(): array
    {
        return $this->icons;
    }

    public function capabilities(): array
    {
        return $this->capabilities;
    }
}
