<?php

namespace SleepingOwl\Admin\Themes;

use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Support\Arrayable;

final class ThemeConfiguration implements Arrayable
{
    private const KEYS = [
        'body_default_class',
        'breadcrumbs',
        'favicon',
        'footer_text',
        'logo',
        'logo_mini',
        'menu_top',
        'show_footer',
        'show_mode',
        'show_version',
        'sidebar_background_color',
        'useHasManyLocalCard',
        'useRelationCard',
        'useWysiwygCard',
        'version_text',
    ];

    /** @var array<string, mixed> */
    private array $values;

    public function __construct(Repository $config)
    {
        $this->values = [];

        foreach (self::KEYS as $key) {
            $this->values[$key] = $config->get("sleeping_owl.{$key}");
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
