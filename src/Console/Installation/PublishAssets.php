<?php

namespace SleepingOwl\Admin\Console\Installation;

use SleepingOwl\Admin\Assets\AssetPublicationReport;
use SleepingOwl\Admin\Assets\PublishedAssetVerifier;

class PublishAssets extends Installator
{
    /** @var list<AssetPublicationReport> */
    private array $reports = [];

    public function showInfo()
    {
        foreach ($this->reports as $report) {
            $this->showReport($report);
        }
    }

    private function showReport(AssetPublicationReport $report): void
    {
        $this->command->line(
            "Publish asset profile [{$report->profile()}], {$report->fileCount()} files verified: <info>✔</info>"
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

        $this->reports = app(PublishedAssetVerifier::class)->verifyAll(
            public_path('packages/sleepingowl/default')
        );
    }
}
