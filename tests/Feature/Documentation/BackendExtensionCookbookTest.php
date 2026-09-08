<?php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Filesystem\Filesystem;
use SleepingOwl\Admin\Console\Scaffolding\ExtensionScaffold;
use SleepingOwl\Admin\Display\DisplayDatatablesAsync;
use SleepingOwl\Admin\Form\FormCard;

final class BackendExtensionCookbookTest extends TestCase
{
    private string $exampleRoot;

    protected function setUp(): void
    {
        parent::setUp();

        $root = dirname(__DIR__, 3);
        $this->exampleRoot = $root.'/docs/modernization/examples/backend-extensions';
        require_once $this->exampleRoot.'/app/Admin/Sections/OrderSection.php';
    }

    public function test_section_uses_current_server_side_table_and_form_contracts(): void
    {
        $section = new App\Admin\Sections\OrderSection($this->app, CookbookOrder::class);

        $display = $section->onDisplay();
        $this->assertInstanceOf(DisplayDatatablesAsync::class, $display);
        $this->assertSame('orders', $display->getName());
        $this->assertSame('POST', $display->getMethod());
        $this->assertSame('table align-middle', $display->getHtmlAttribute('class'));
        $this->assertCount(4, $display->getColumns()->all());
        $this->assertCount(1, $display->getColumnFilters()->all());
        $this->assertSame('card.heading', $display->getColumnFilters()->getPlacement());

        $this->assertInstanceOf(FormCard::class, $section->onCreate());
        $this->assertInstanceOf(FormCard::class, $section->onEdit());
    }

    public function test_copyable_php_examples_are_syntax_checked(): void
    {
        foreach ($this->phpExamples() as $path) {
            $tokens = token_get_all((string) file_get_contents($path), TOKEN_PARSE);

            $this->assertNotEmpty($tokens, $path);
        }
    }

    public function test_guide_covers_every_maintained_extension_stub(): void
    {
        $guide = (string) file_get_contents(dirname(__DIR__, 3).'/docs/modernization/backend-extension-cookbook.md');
        $scaffold = new ExtensionScaffold(new Filesystem());

        foreach ($scaffold->supportedTypes() as $type) {
            $this->assertStringContainsString("sleepingowl:extension:make {$type}", $guide);
        }

        $this->assertStringContainsString('AdminDisplay::datatables()', $guide);
        $this->assertStringContainsString('ADMIN_DEV_ASSETS=true', $guide);
        $this->assertStringContainsString('MetaInterface', $guide);
    }

    private function phpExamples(): array
    {
        return [
            $this->exampleRoot.'/app/Admin/Sections/OrderSection.php',
            $this->exampleRoot.'/app/Providers/OrdersAdminServiceProvider.php',
            $this->exampleRoot.'/app/Admin/navigation.php',
            $this->exampleRoot.'/routes/admin.php',
        ];
    }
}

final class CookbookOrder extends Model
{
    protected $guarded = [];
}
