<?php

namespace SleepingOwl\Admin\Assets;

final class AssetPublicationReport
{
    public function __construct(
        private string $profile,
        private string $packageVersion,
        private string $buildId,
        private int $fileCount
    ) {
    }

    public function profile(): string
    {
        return $this->profile;
    }

    public function packageVersion(): string
    {
        return $this->packageVersion;
    }

    public function buildId(): string
    {
        return $this->buildId;
    }

    public function fileCount(): int
    {
        return $this->fileCount;
    }
}
