<?php

use PHPUnit\Framework\Attributes\DataProvider;

class AssetHealthLocalizationTest extends TestCase
{
    #[DataProvider('localizedMessages')]
    public function test_asset_health_copy_exists_in_every_supported_locale(
        string $locale,
        string $message,
        string $command
    ): void {
        $this->app->setLocale($locale);

        $this->assertSame(
            $message,
            trans('sleeping_owl::lang.asset_health.message', [
                'published' => '12.0.0',
                'installed' => '12.1.0',
            ])
        );
        $this->assertSame($command, trans('sleeping_owl::lang.asset_health.command'));
    }

    public function test_unknown_locale_uses_the_english_fallback(): void
    {
        $this->app['translator']->setFallback('en');
        $this->app->setLocale('fr');

        $this->assertSame(
            'Published admin assets (12.0.0) do not match the installed package (12.1.0).',
            trans('sleeping_owl::lang.asset_health.message', [
                'published' => '12.0.0',
                'installed' => '12.1.0',
            ])
        );
        $this->assertSame('Update assets:', trans('sleeping_owl::lang.asset_health.command'));
    }

    public static function localizedMessages(): iterable
    {
        yield 'German' => [
            'de',
            'Die veröffentlichten Admin-Assets (12.0.0) passen nicht zum installierten Paket (12.1.0).',
            'Assets aktualisieren:',
        ];
        yield 'English' => [
            'en',
            'Published admin assets (12.0.0) do not match the installed package (12.1.0).',
            'Update assets:',
        ];
        yield 'Russian' => [
            'ru',
            'Опубликованные ассеты админки (12.0.0) не соответствуют установленной версии пакета (12.1.0).',
            'Обновить ассеты:',
        ];
        yield 'Ukrainian' => [
            'uk',
            'Опубліковані асети адмінки (12.0.0) не відповідають установленій версії пакета (12.1.0).',
            'Оновити асети:',
        ];
        yield 'Simplified Chinese' => [
            'zh-CN',
            '已发布的管理资源 (12.0.0) 与已安装的软件包版本 (12.1.0) 不匹配。',
            '更新资源：',
        ];
    }
}
