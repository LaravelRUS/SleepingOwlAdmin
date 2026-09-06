<?php

use Illuminate\Foundation\Application;
use SleepingOwl\Admin\Configuration\ProvidesScriptVariables;

class DataTablesRuntimeConfigTest extends TestCase
{
    public function test_table_state_and_highlight_flags_are_exported_to_javascript(): void
    {
        $variables = $this->scriptVariables([
            'datatables_highlight' => true,
            'state_datatables' => true,
            'state_filters' => true,
        ]);

        $this->assertTrue($variables['state_datatables']);
        $this->assertTrue($variables['state_filters']);
        $this->assertTrue($variables['datatables_highlight']);
    }

    public function test_filter_state_is_disabled_when_datatables_state_is_disabled(): void
    {
        $variables = $this->scriptVariables([
            'datatables_highlight' => false,
            'state_datatables' => false,
            'state_filters' => true,
        ]);

        $this->assertFalse($variables['state_datatables']);
        $this->assertFalse($variables['state_filters']);
        $this->assertFalse($variables['datatables_highlight']);
    }

    private function scriptVariables(array $overrides): array
    {
        $config = array_replace(config('sleeping_owl'), $overrides);

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
