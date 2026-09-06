<?php

namespace SleepingOwl\Admin\Console\Installation;

use SleepingOwl\Admin\Assets\AssetPublicationReport;
use SleepingOwl\Admin\Assets\PublishedAssetVerifier;

class PublishAssets extends Installator
{
    private ?AssetPublicationReport $report = null;

    public function showInfo()
    {
        $profile = $this->report?->profile() ?? 'unknown';
        $files = $this->report?->fileCount() ?? 0;

        $this->command->line(
            "Publish asset profile [{$profile}], {$files} files verified: <info>✔</info>"
        );
    }

    /**
     * Install the components.
     *
     * @return void
     */
    public function install()
    {
        $this->command->call('vendor:publish', [
            '--tag' => 'assets',
            '--force' => true,
        ]);

        $this->report = app(PublishedAssetVerifier::class)->verify(
            public_path('packages/sleepingowl/default')
        );
    }
}
