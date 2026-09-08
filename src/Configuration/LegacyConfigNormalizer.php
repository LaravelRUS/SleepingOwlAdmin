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

        if (! array_key_exists('enable_editor', $config)) {
            $config['enable_editor'] = $config['show_editor'];
        }

        return $config;
    }

    private function deprecateShowEditor(): void
    {
        $message = 'The sleeping_owl.show_editor config key is deprecated; use enable_editor instead.';

        if (function_exists('trigger_deprecation')) {
            trigger_deprecation('laravelrus/sleepingowl', '13.0', $message);

            return;
        }

        @trigger_error($message, E_USER_DEPRECATED);
    }
}
