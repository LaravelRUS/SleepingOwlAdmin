<?php

namespace SleepingOwl\Admin\Assets;

final class PublishedAssetHealth
{
    private bool $resolved = false;

    private ?AssetHealthStatus $status = null;

    public function __construct(
        private AssetManifest $manifest,
        private ComposerPackageVersion $packageVersion,
        private AssetVersionMatcher $versions
    ) {
    }

    public function status(): ?AssetHealthStatus
    {
        if (! $this->resolved) {
            $this->status = $this->resolveStatus();
            $this->resolved = true;
        }

        return $this->status;
    }

    private function resolveStatus(): ?AssetHealthStatus
    {
        $installed = $this->packageVersion->current();
        $published = $this->manifest->packageVersion();

        if ($this->versions->matches($installed, $published)) {
            return null;
        }

        return new AssetHealthStatus($installed, $published);
    }
}
