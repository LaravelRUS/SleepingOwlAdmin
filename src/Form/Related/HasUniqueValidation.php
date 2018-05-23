<?php

namespace SleepingOwl\Admin\Form\Related;

use Validator;

trait HasUniqueValidation
{
    protected $unique;

    /**
     * @param array $columns
     * @param string|null $message
     *
     * @return static
     */
    public function unique(array $columns, $message = null)
    {
        $this->initializeUniqueValidator($message);
        $this->unique = $columns;

        return $this;
    }

    protected function initializeUniqueValidator($message = null)
    {
        Validator::extendImplicit('unique_related', function () {
            return false;
        }, $message);
    }

    public function getValidationRules()
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
                $key = $this->getCompositeKey($relation, (array) $parameters);

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
