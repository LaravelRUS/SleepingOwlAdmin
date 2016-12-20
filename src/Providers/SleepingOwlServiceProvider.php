<?php

namespace SleepingOwl\Admin\Providers;

use SleepingOwl\Admin\Contracts\AdminInterface;

class SleepingOwlServiceProvider extends AdminSectionsServiceProvider
{
    public function register()
    {
        $this->mergeConfigFrom(__DIR__.'/../../config/sleeping_owl.php', 'sleeping_owl');
        $this->loadViewsFrom(__DIR__.'/../../resources/views', 'sleeping_owl');

        $this->registerProviders();
        $this->registerCommands();

        if (file_exists($assetsFile = __DIR__.'/../../resources/assets.php')) {
            include $assetsFile;
        }
    }

    /**
     * @param AdminInterface $admin
     */
    public function boot(AdminInterface $admin)
    {
        $this->loadTranslationsFrom(__DIR__.'/../../resources/lang', 'sleeping_owl');

        $this->publishes([
            __DIR__.'/../../public' => public_path('packages/sleepingowl/'),
        ], 'assets');

        $this->publishes([
            __DIR__.'/../../config/sleeping_owl.php' => config_path('sleeping_owl.php'),
        ], 'config');

        parent::boot($admin);
    }

    public function registerProviders()
    {
        $providers = [
            \Collective\Html\HtmlServiceProvider::class,
            \DaveJamesMiller\Breadcrumbs\ServiceProvider::class,
            AdminServiceProvider::class,
            AliasesServiceProvider::class,
        ];

        foreach ($providers as $providerClass) {
            $this->app->register($providerClass);
        }

        /* Workaround to allow use ServiceProvider-based configurations in old fashion */
        if (is_file(app_path('Providers/AdminSectionsServiceProvider.php'))) {
            $this->app->register($this->app->getNamespace().'Providers\\AdminSectionsServiceProvider');
        }
    }

    protected function registerCommands()
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                \SleepingOwl\Admin\Console\Commands\InstallCommand::class,
                \SleepingOwl\Admin\Console\Commands\UpdateCommand::class,
                \SleepingOwl\Admin\Console\Commands\UserManagerCommand::class,
                \SleepingOwl\Admin\Console\Commands\SectionGenerate::class,
                \SleepingOwl\Admin\Console\Commands\SectionMake::class,
                \SleepingOwl\Admin\Console\Commands\SectionPolicies::class,
                \SleepingOwl\Admin\Console\Commands\SectionProvider::class,
            ]);
        }
    }

    /**
     * @return array
     */
    public static function compiles()
    {
        return [
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\NamedColumnInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\ActionInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\ColumnInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Initializable.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\ModelConfigurationInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Display\DisplayColumnFactoryInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\WithRoutesInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Display\DisplayColumnEditableFactoryInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Display\ColumnEditableInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Display\DisplayColumnFilterFactoryInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\ColumnFilterInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Display\DisplayFactoryInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\AdminInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Template\TemplateInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Template\MetaInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Navigation\NavigationInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\DisplayInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Display\TabInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\FormElementInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Form\ElementsInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\FormInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Form\FormElementFactoryInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Form\Columns\ColumnInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Display\DisplayFilterFactoryInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\FilterInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Wysiwyg\WysiwygMangerInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Wysiwyg\WysiwygEditorInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Wysiwyg\WysiwygFilterInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\RepositoryInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Contracts\Form\FormFactoryInterface.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Traits\Assets.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Traits\SqlQueryOperators.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Traits\FormElements.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Model\ModelConfigurationManager.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Model\SectionModelConfiguration.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Factories\DisplayColumnFactory.php'),
            base_path('vendor\laravelrus\sleepingowl\src\AliasBinder.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\TableColumn.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\NamedColumn.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Action.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Checkbox.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Control.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Count.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Custom.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\DateTime.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Filter.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Image.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Lists.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Order.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Text.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Url.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Link.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\RelatedLink.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Email.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\TreeControl.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Editable\Checkbox.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Filter\BaseColumnFilter.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Filter\Text.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Filter\Date.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Filter\Range.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Column\Filter\Select.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Admin.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Templates\TemplateDefault.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Templates\Meta.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Navigation.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Display.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\DisplayTable.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\DisplayDatatables.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\DisplayDatatablesAsync.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\DisplayTree.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\DisplayTab.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\DisplayTabbed.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Navigation\Page.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\FormElement.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\FormElements.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\FormDefault.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\FormTabbed.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\FormPanel.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Columns\Column.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Columns\Columns.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\NamedFormElement.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\DateTime.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Date.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Time.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Timestamp.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Text.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\TextAddon.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Select.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\MultiSelect.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Hidden.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Checkbox.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Radio.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Wysiwyg.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\CKEditor.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Custom.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Password.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Textarea.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\View.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\File.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Image.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Images.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Upload.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Html.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Form\Element\Number.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Filter\FilterBase.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Filter\FilterScope.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Filter\FilterField.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Filter\FilterCustom.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Display\Filter\FilterRelated.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Facades\WysiwygManager.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Wysiwyg\Manager.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Wysiwyg\Editor.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Wysiwyg\DummyFilter.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Wysiwyg\MarkdownFilter.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Section.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Repository\BaseRepository.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Factories\DisplayColumnEditableFactory.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Factories\DisplayColumnFilterFactory.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Factories\DisplayFactory.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Factories\FormFactory.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Factories\FormElementFactory.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Factories\DisplayFilterFactory.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Facades\Display.php'),
            base_path('vendor\laravelrus\sleepingowl\src\Facades\Template.php'),
        ];
    }
}
