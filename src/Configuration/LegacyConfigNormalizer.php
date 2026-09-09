<?php

namespace SleepingOwl\Admin\Configuration;

final class LegacyConfigNormalizer
{
    /**
     * @param  array<string, mixed>  $config
     * @return array<string, mixed>
     */
    public function normalize(array $config): array
    {
        if (! array_key_exists('show_editor', $config)) {
            return $config;
        }

        $this->deprecateShowEditor();

        if (! isset($config['env']) || ! is_array($config['env'])) {
            $config['env'] = [];
        }

        if (! array_key_exists('enabled', $config['env'])) {
            $config['env']['enabled'] = $config['show_editor'];
        }

        return $config;
    }

    private function deprecateShowEditor(): void
    {
        $message = 'The sleeping_owl.show_editor config key is deprecated; use env.enabled instead.';

        if (function_exists('trigger_deprecation')) {
            trigger_deprecation('laravelrus/sleepingowl', '13.0', $message);

            return;
        }

        @trigger_error($message, E_USER_DEPRECATED);
    }
}
