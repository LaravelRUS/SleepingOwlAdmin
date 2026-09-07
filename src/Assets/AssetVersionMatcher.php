<?php

namespace SleepingOwl\Admin\Assets;

final class AssetVersionMatcher
{
    public function matches(string $installed, string $published): bool
    {
        $installed = $this->normalize($installed);
        $published = $this->normalize($published);

        return $installed === $published
            || ($this->isDevelopment($installed) && $this->isDevelopment($published));
    }

    private function normalize(string $version): string
    {
        return ltrim(trim($version), 'v');
    }

    private function isDevelopment(string $version): bool
    {
        return str_starts_with($version, 'dev-');
    }
}
