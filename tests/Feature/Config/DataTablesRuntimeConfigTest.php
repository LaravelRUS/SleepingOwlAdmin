<?php

use Illuminate\Foundation\Application;
use SleepingOwl\Admin\Configuration\ProvidesScriptVariables;

class DataTablesRuntimeConfigTest extends TestCase
{
    public function test_table_runtime_flags_are_exported_to_javascript(): void
    {
        $variables = $this->scriptVariables([
            'datatables_settings' => [
                'datatables_highlight' => true,
                'datatables_inline_edit_refresh' => 'table',
                'state_datatables' => true,
                'state_filters' => true,
            ],
        ]);

        $this->assertTrue($variables['datatables_settings']['state_datatables']);
        $this->assertTrue($variables['datatables_settings']['state_filters']);
        $this->assertTrue($variables['datatables_settings']['datatables_highlight']);
        $this->assertSame('table', $variables['datatables_settings']['datatables_inline_edit_refresh']);
    }

    public function test_inline_edit_refresh_defaults_to_enabled_for_legacy_project_configs(): void
    {
        $config = config('sleeping_owl');
        unset($config['datatables_settings']['datatables_inline_edit_refresh']);

        $variables = (new DataTablesScriptVariablesStub($this->app, $config))->scriptVariables();

        $this->assertSame('row', $variables['datatables_settings']['datatables_inline_edit_refresh']);
    }

    public function test_filter_state_is_disabled_when_datatables_state_is_disabled(): void
    {
        $variables = $this->scriptVariables([
            'datatables_settings' => [
                'datatables_highlight' => false,
                'state_datatables' => false,
                'state_filters' => true,
            ],
        ]);

        $this->assertFalse($variables['datatables_settings']['state_datatables']);
        $this->assertFalse($variables['datatables_settings']['state_filters']);
        $this->assertFalse($variables['datatables_settings']['datatables_highlight']);
    }

    private function scriptVariables(array $overrides): array
    {
        $config = array_replace_recursive(config('sleeping_owl'), $overrides);

        return (new DataTablesScriptVariablesStub($this->app, $config))->scriptVariables();
    }
}

final class DataTablesScriptVariablesStub
{
    use ProvidesScriptVariables;

    protected Application $app;

    /** @var array<string, mixed> */
    protected array $config;

    public function __construct(Application $app, array $config)
    {
        $this->app = $app;
        $this->config = $config;
    }
}
