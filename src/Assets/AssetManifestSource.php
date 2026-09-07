<?php

namespace SleepingOwl\Admin\Assets;

use InvalidArgumentException;

final class AssetManifestSource
{
    public function __construct(
        private AssetManifest $manifest,
        private string $publicRoot
    ) {
        $this->publicRoot = $this->normalizePublicRoot($publicRoot);
    }

    public function manifest(): AssetManifest
    {
        return $this->manifest;
    }

    public function publicRoot(): string
    {
        return $this->publicRoot;
    }

    private function normalizePublicRoot(string $publicRoot): string
    {
        $publicRoot = trim($publicRoot, '/');
        if ($publicRoot === '' || str_contains($publicRoot, '..') || str_contains($publicRoot, '\\')) {
            throw new InvalidArgumentException('Asset public root must be a relative URL path.');
        }

        return $publicRoot;
    }
}
