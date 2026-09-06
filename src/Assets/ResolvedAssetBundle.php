<?php

namespace SleepingOwl\Admin\Assets;

final class ResolvedAssetBundle
{
    /**
     * @param  list<string>  $scripts
     * @param  list<string>  $styles
     */
    public function __construct(
        private array $scripts,
        private array $styles
    ) {
    }

    /**
     * @return list<string>
     */
    public function scripts(): array
    {
        return $this->scripts;
    }

    /**
     * @return list<string>
     */
    public function styles(): array
    {
        return $this->styles;
    }
}
