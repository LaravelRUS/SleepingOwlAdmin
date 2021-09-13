<?php

namespace SleepingOwl\Admin\Console\Commands;

use Illuminate\Console\GeneratorCommand as SectionGeneratorCommand;
use Symfony\Component\Console\Input\InputArgument;

class SectionMake extends SectionGeneratorCommand
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'sleepingowl:section:make';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new section class';

    /**
     * The type of class being generated.
     *
     * @var string
     */
    protected $type = 'Section';

    /**
     * Determine if the class already exists.
     *
     * @param  string  $rawName
     * @return bool
     */
    protected function alreadyExists($rawName)
    {
        return class_exists($rawName);
    }

    /**
     * Get the stub file for the generator.
     *
     * @return string
     */
    protected function getStub()
    {
        return __DIR__.'/stubs/section.stub';
    }

    /**
     * Get the default namespace for the class.
     *
     * @param  string  $rootNamespace
     * @return string
     */
    protected function getDefaultNamespace($rootNamespace)
    {
        return $rootNamespace;
    }

    /**
     * Replace the class name for the given stub.
     *
     * @param  string  $stub
     * @param  string  $name
     * @return string
     */
    protected function replaceClass($stub, $name)
    {
        $stub = parent::replaceClass($stub, $name);

        return str_replace('DummyModel', '\\'.trim((string) $this->argument('model'), '\\'), $stub);
    }

    /**
     * Get the console command arguments.
     *
     * @return array
     */
    protected function getArguments()
    {
        $arguments = parent::getArguments();
        $arguments[] = ['model', InputArgument::REQUIRED, 'The name of the model class'];

        return $arguments;
    }
}
