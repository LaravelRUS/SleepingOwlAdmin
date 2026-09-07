<?php

namespace SleepingOwl\Admin\Assets;

final class AssetManifestRegistry
{
    /** @var array<string, array<string, array<string, AssetManifestSource>>> */
    private array $sources = [];

    private ?string $selectedTheme = null;

    public function register(string $themeId, AssetManifest $manifest, string $publicRoot): void
    {
        $source = new AssetManifestSource($manifest, $publicRoot);

        foreach ($manifest->profileIds() as $profileId) {
            foreach ($manifest->profile($profileId)->entryIds() as $logicalId) {
                $this->sources[$themeId][$profileId][$logicalId] = $source;
            }
        }
    }

    public function select(string $themeId): void
    {
        $this->selectedTheme = $themeId;
    }

    public function find(string $profileId, string $logicalId): ?AssetManifestSource
    {
        if ($this->selectedTheme === null) {
            return null;
        }

        return $this->sources[$this->selectedTheme][$profileId][$logicalId] ?? null;
    }
}
