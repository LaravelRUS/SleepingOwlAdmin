<?php

namespace SleepingOwl\Admin\Assets;

use Composer\InstalledVersions;
use SleepingOwl\Admin\Exceptions\AssetManifestException;

final class ComposerPackageVersion
{
    private const PACKAGE = 'laravelrus/sleepingowl';

    public function current(): string
    {
        if (InstalledVersions::isInstalled(self::PACKAGE)) {
            $version = InstalledVersions::getPrettyVersion(self::PACKAGE);
        } else {
            $root = InstalledVersions::getRootPackage();
            $version = ($root['name'] ?? null) === self::PACKAGE
                ? ($root['pretty_version'] ?? null)
                : null;
        }

        if (! is_string($version) || trim($version) === '') {
            throw new AssetManifestException('Unable to determine the installed SleepingOwl version.');
        }

        return $version;
    }
}
