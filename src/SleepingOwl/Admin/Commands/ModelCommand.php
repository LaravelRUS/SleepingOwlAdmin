<?php namespace SleepingOwl\Admin\Commands;

use Config;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use SleepingOwl\Admin\Commands\Compilers\ModelCompiler;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class ModelCommand extends Command
{
	/**
	 * The console command name.
	 * @var string
	 */
	protected $name = 'admin:model';

	/**
	 * The console command description.
	 * @var string
	 */
	protected $description = 'Create new admin model file.';

	/**
	 * Execute the console command.
	 * @return void
	 */
	public function fire()
	{
		$compiler = new ModelCompiler($this, $this->getModelClass(), $this->option('title'));
		$compiler->parseColumns($this->option('columns'));
		$compiler->generateForm();

		$template = $this->getTemplate();
		$replacement = $compiler->getReplacements();
		$template = $this->makeReplacements($template, $replacement);

		$this->saveResult($compiler->getModelClass(), $template);
	}

	/**
	 * @return string
	 */
	protected function getModelClass()
	{
		$modelClass = str_replace('/', '\\', $this->argument('modelClass'));
		if ( ! class_exists($modelClass))
		{
			$this->error('Class "' . $modelClass . '" not found.');
			exit(1);
		}
		return $modelClass;
	}

	/**
	 * @return string
	 */
	protected function getTemplate()
	{
		return file_get_contents(__DIR__ . '/stubs/model.stub');
	}

	/**
	 * @param $template
	 * @param $replacement
	 * @return string
	 */
	protected function makeReplacements($template, $replacement)
	{
		return strtr($template, $replacement);
	}

	/**
	 * @param $modelClass
	 * @param $template
	 */
	protected function saveResult($modelClass, $template)
	{
		$filename = class_basename($modelClass) . '.php';
		$file = Config::get('admin.bootstrapDirectory') . '/' . $filename;
		if (file_exists($file))
		{
			$result = $this->confirm('File "' . $filename . '" already exist in your admin bootstrap directory. Overwrite?', false);
			if ( ! $result) return;
		}
		file_put_contents($file, $template);

		$this->info('File "' . $filename . '" was created.');
	}

	/**
	 * Get the console command arguments.
	 * @return array
	 */
	protected function getArguments()
	{
		return [
			[
				'modelClass',
				InputArgument::REQUIRED,
				'Model class name.'
			],
		];
	}

	/**
	 * Get the console command options.
	 * @return array
	 */
	protected function getOptions()
	{
		return [
			[
				'title',
				null,
				InputOption::VALUE_REQUIRED,
				'Model title to display in menu and headings.'
			],
			[
				'columns',
				null,
				InputOption::VALUE_REQUIRED,
				'Columns to display in table view.'
			],
		];
	}

}
