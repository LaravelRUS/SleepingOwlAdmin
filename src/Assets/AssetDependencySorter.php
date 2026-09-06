<?php

namespace SleepingOwl\Admin\Assets;

final class AssetDependencySorter
{
    /**
     * @param  iterable<Asset>  $assets
     * @return list<Asset>
     */
    public function sort(iterable $assets): array
    {
        $remaining = $this->index($assets);
        $sorted = [];

        while ($remaining !== []) {
            $handle = $this->nextReadyHandle($remaining, $sorted);
            $handle ??= array_key_first($remaining);

            $sorted[$handle] = $remaining[$handle];
            unset($remaining[$handle]);
        }

        return array_values($sorted);
    }

    /**
     * @param  iterable<Asset>  $assets
     * @return array<string, Asset>
     */
    private function index(iterable $assets): array
    {
        $indexed = [];

        foreach ($assets as $asset) {
            $indexed[$asset->handle()] = $asset;
        }

        return $indexed;
    }

    /**
     * @param  array<string, Asset>  $remaining
     * @param  array<string, Asset>  $sorted
     */
    private function nextReadyHandle(array $remaining, array $sorted): ?string
    {
        foreach ($remaining as $handle => $asset) {
            if ($this->dependenciesAreReady($asset, $remaining, $sorted)) {
                return $handle;
            }
        }

        return null;
    }

    /**
     * @param  array<string, Asset>  $remaining
     * @param  array<string, Asset>  $sorted
     */
    private function dependenciesAreReady(Asset $asset, array $remaining, array $sorted): bool
    {
        foreach ($asset->dependencies() as $dependency) {
            if ($dependency === $asset->handle() || isset($sorted[$dependency])) {
                continue;
            }

            if (isset($remaining[$dependency])) {
                return false;
            }
        }

        return true;
    }
}
