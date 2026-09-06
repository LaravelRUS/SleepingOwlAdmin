<?php

namespace SleepingOwl\Admin\Assets;

use Illuminate\Contracts\Config\Repository;

final class AssetProfileSelector
{
    public const DEVELOPMENT = 'development';

    public const PRODUCTION = 'production';

    public function __construct(private Repository $config)
    {
    }

    public function selected(): string
    {
        return $this->config->get('sleeping_owl.dev_assets')
            ? self::DEVELOPMENT
            : self::PRODUCTION;
    }
}
