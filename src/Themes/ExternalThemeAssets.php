<?php

namespace SleepingOwl\Admin\Themes;

use InvalidArgumentException;
use SleepingOwl\Admin\Assets\AssetManifest;
use SleepingOwl\Admin\Contracts\Theme\ThemeInterface;

final class ExternalThemeAssets
{
    private const REQUIRED_PROFILES = ['production', 'development'];

    public function validate(ThemeInterface $theme, AssetManifest $manifest): void
    {
        $themeAssets = ThemeAssetManifest::fromTheme($theme);
        $this->assertProfiles($manifest);

        $expectedEntries = null;
        foreach ($manifest->profileIds() as $profileId) {
            $entries = $manifest->profile($profileId)->entryIds();
            $this->assertEntries($entries, $themeAssets);

            if ($expectedEntries !== null && $entries !== $expectedEntries) {
                throw new InvalidArgumentException('External theme asset profiles must expose identical entries.');
            }

            $expectedEntries = $entries;
        }
    }

    private function assertProfiles(AssetManifest $manifest): void
    {
        foreach (self::REQUIRED_PROFILES as $profileId) {
            if (! in_array($profileId, $manifest->profileIds(), true)) {
                throw new InvalidArgumentException("External theme assets require the [{$profileId}] profile.");
            }
        }
    }

    /**
     * @param  list<string>  $entries
     */
    private function assertEntries(array $entries, ThemeAssetManifest $themeAssets): void
    {
        $declared = $themeAssets->entries();
        $themeEntry = 'theme:'.$themeAssets->themeId();
        if (! in_array($themeEntry, $declared, true)) {
            throw new InvalidArgumentException(
                "External theme [{$themeAssets->themeId()}] must declare [{$themeEntry}]."
            );
        }

        $required = array_values(array_filter(
            $declared,
            static fn (string $entry): bool => ! str_starts_with($entry, 'shared:')
        ));

        if (array_diff($entries, $declared) !== [] || array_diff($required, $entries) !== []) {
            throw new InvalidArgumentException(
                "External theme manifest entries must match theme [{$themeAssets->themeId()}] assets."
            );
        }
    }
}
