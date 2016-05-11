<?php

namespace SleepingOwl\Admin\Display\Extension;

use Illuminate\Database\Eloquent\Builder;

class Scopes extends Extension
{
    /**
     * @var string[]
     */
    protected $scopes = [];

    /**
     * @return string[]
     */
    public function all()
    {
        return $this->scopes;
    }

    /**
     * @param array|string $scopes
     *
     * @return $this
     */
    public function set($scopes)
    {
        $this->scopes = func_get_args();

        return $this->getDisplay();
    }

    /**
     * @param string $scope
     *
     * @return $this
     */
    public function push($scope)
    {
        if (! is_array($scope)) {
            $scope = func_get_args();
        }

        $this->scopes[] = $scope;

        return $this;
    }

    /**
     * Get the instance as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'scopes' => $this->scopes,
        ];
    }

    /**
     * @param Builder $query
     */
    public function modifyQuery(Builder $query)
    {
        foreach ($this->scopes as $scope) {
            if (! is_null($scope)) {
                if (is_array($scope)) {
                    $method = array_shift($scope);
                    $params = $scope;
                } else {
                    $method = $scope;
                    $params = [];
                }

                call_user_func_array([
                    $query,
                    $method,
                ], $params);
            }
        }
    }
}
