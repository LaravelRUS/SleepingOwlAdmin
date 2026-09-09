<?php

namespace SleepingOwl\Admin\Themes;

use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Support\Arrayable;

final class ThemeConfiguration implements Arrayable
{
    private const KEYS = [
        'title',
        'logo',
        'logo_mini',
        'menu_top',
        'favicon',
        'body_default_class',
        'sidebar_background_color',
        'breadcrumbs',
        'show_color_mode_toggle',
        'scroll_to_top',
        'scroll_to_bottom',
        'show_footer',
        'footer_text',
        'show_version',
        'version_text',
        'useWysiwygCard',
        'useRelationCard',
        'useHasManyLocalCard',
    ];

    /** @var array<string, mixed> */
    private array $values;

    public function __construct(Repository $config)
    {
        $this->values = [];

        foreach (self::KEYS as $key) {
            $this->values[$key] = $config->get("sleeping_owl.ui.{$key}");
        }
    }

    public function get(string $key, mixed $default = null): mixed
    {
        return array_key_exists($key, $this->values)
            ? $this->values[$key]
            : $default;
    }

    /**
     * @return list<string>
     */
    public function keys(): array
    {
        return self::KEYS;
    }

    /**
     * @return array<string, mixed>
     */
    public function all(): array
    {
        return $this->values;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return $this->all();
    }
}
