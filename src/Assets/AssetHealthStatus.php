<?php

namespace SleepingOwl\Admin\Assets;

final class AssetHealthStatus
{
    private const UPDATE_COMMAND = 'php artisan sleepingowl:update';

    public function __construct(
        private string $installedVersion,
        private string $publishedVersion
    ) {
    }

    public function installedVersion(): string
    {
        return $this->installedVersion;
    }

    public function publishedVersion(): string
    {
        return $this->publishedVersion;
    }

    public function updateCommand(): string
    {
        return self::UPDATE_COMMAND;
    }
}
