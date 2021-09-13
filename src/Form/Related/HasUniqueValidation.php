<?php

namespace SleepingOwl\Admin\Form\Related;

use Illuminate\Support\Facades\Validator;

trait HasUniqueValidation
{
    protected $unique;

    /**
     * Columns, that should be unique.
     *
     * @param  array  $columns
     * @param  string|null  $message
     * @return static
     */
    public function unique(array $columns, string $message = null)
    {
        $this->initializeUniqueValidator($message);
        $this->unique = $columns;

        return $this;
    }

    protected function initializeUniqueValidator(string $message = null)
    {
        Validator::extendImplicit('unique_related', function () {
            return false;
        }, $message);
    }

    public function getValidationRules(): array
    {
        $this->addUniqueValidation();

        return parent::getValidationRules();
    }

    protected function addUniqueValidation()
    {
        if (count((array) $this->unique) > 0) {
            $pairs = [];
            $parameters = array_unique(array_merge([
                $mainKey = $this->getModel()->getForeignKey(),
            ], $this->unique));

            $errorColumns = array_filter($parameters, function ($param) use ($mainKey) {
                return $param !== $mainKey;
            });

            $relations = (array) request($this->relationName);

            foreach ($relations as $index => $relation) {
                $relation[$mainKey] = $this->getModel()->getKey();
                $key = $this->getCompositeKey($relation, $parameters);

                if (array_key_exists($key, $pairs)) {
                    foreach ($errorColumns as $column) {
                        $this->validationRules[$this->relationName.'.'.$index.'.'.$column] = 'unique_related';
                    }
                } else {
                    $pairs[$key] = true;
                }
            }
        }
    }
}
