<?php

namespace SleepingOwl\Admin\Console\Commands;

use Illuminate\Config\Repository;
use Illuminate\Filesystem\Filesystem;
use SleepingOwl\Admin\Assets\PublishedAssetVerifier;
use SleepingOwl\Admin\Console\Installation;
use SleepingOwl\Admin\Exceptions\AssetManifestException;

class UpdateCommand extends Installation\Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sleepingowl:update
                {--check : Verify both published asset profiles without changing files}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update the SleepingOwl Admin package';

    /**
     * Execute the console command.
     *
     * @param  Filesystem  $files
     */
    public function fire(Filesystem $files)
    {
        return $this->executeCommand(app(PublishedAssetVerifier::class));
    }

    /**
     * @param  Filesystem  $files
     */
    public function handle(Filesystem $files)
    {
        return $this->executeCommand(app(PublishedAssetVerifier::class));
    }

    private function executeCommand(PublishedAssetVerifier $verifier): int
    {
        if ($this->option('check')) {
            return $this->checkAssets($verifier);
        }

        $this->runInstaller();

        return self::SUCCESS;
    }

    private function checkAssets(PublishedAssetVerifier $verifier): int
    {
        try {
            $reports = $verifier->verifyAll(public_path('packages/sleepingowl/default'));
        } catch (AssetManifestException $exception) {
            $this->components->error($exception->getMessage());

            return self::FAILURE;
        }

        foreach ($reports as $report) {
            $this->line(
                "Asset profile [{$report->profile()}], {$report->fileCount()} files verified: <info>✔</info>"
            );
        }

        return self::SUCCESS;
    }

    protected function runInstaller()
    {
        $installer = new Installation\PublishAssets(
            $this,
            new Repository($this->laravel['config']->get('sleeping_owl', []))
        );

        $installer->install();
        $installer->showInfo();
//        $this->callSilent('sleepingowl:ide:generate');

        $this->comment('SleepingOwl Framework successfully updated.');
    }
}
