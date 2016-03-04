<?php

namespace SleepingOwl\Admin\Display\Extension;

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
     * @param array $scopes
     *
     * @return $this
     */
    public function set(array $scopes)
    {
        if (! is_array($scopes)) {
            $scopes = func_get_args();
        }

        $this->scopes = $scopes;

        return $this;
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
     * @param \Illuminate\Database\Eloquent\Builder $query
     */
    public function modifyQuery(\Illuminate\Database\Eloquent\Builder $query)
    {
        foreach ($this->scopes as $scope) {
            if (! is_null($scope)) {
                $method = array_shift($scope);

                call_user_func_array([
                    $query,
                    $method,
                ], $scope);
            }
        }
    }
}
