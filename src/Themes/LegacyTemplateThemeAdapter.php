<?php

namespace SleepingOwl\Admin\Themes;

use SleepingOwl\Admin\Contracts\Template\TemplateInterface;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

/**
 * Temporary bridge for themes implemented through the legacy template contract.
 *
 * @deprecated Implement ThemeInterface directly after the legacy template migration.
 */
final class LegacyTemplateThemeAdapter implements ThemeInterface
{
    private array $assets;

    private array $icons;

    private array $capabilities;

    /**
     * @param  list<string>  $assets
     * @param  array<string, string>  $icons
     * @param  list<string>  $capabilities
     */
    public function __construct(
        private TemplateInterface $template,
        private string $id = 'legacy-template',
        array $assets = [],
        array $icons = [],
        array $capabilities = []
    ) {
        $this->assets = (new ThemeAssetManifest($id, $assets))->entries();
        $this->icons = (new ThemeIcons($icons))->all();
        $this->capabilities = (new ThemeCapabilities($capabilities))->ids();
    }

    public function id(): string
    {
        return $this->id;
    }

    public function viewNamespace(): string
    {
        return $this->template->getViewNamespace();
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

    public function legacyTemplate(): TemplateInterface
    {
        return $this->template;
    }
}
