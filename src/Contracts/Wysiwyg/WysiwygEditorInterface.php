<?php

namespace SleepingOwl\Admin\Contracts\Wysiwyg;

use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Support\Arrayable;

interface WysiwygEditorInterface extends Arrayable
{
    /**
     * @return string
     */
    public function getId(): string;

    /**
     * @return string
     */
    public function getName(): string;

    /**
     * @return WysiwygFilterInterface
     */
    public function getFilter(): WysiwygFilterInterface;

    /**
     * @return Repository
     */
    public function getConfig(): Repository;

    /**
     * @return bool
     */
    public function isUsed(): bool;

    /**
     * @param string $text
     * @return string
     */
    public function applyFilter(string $text): string;

    /**
     * @return bool|null
     */
    public function load(): ?bool;

    /**
     * @return bool
     */
    public function unload(): bool;
}
