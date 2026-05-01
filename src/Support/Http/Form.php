<?php

namespace SleepingOwl\Admin\Support\Http;

use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;

abstract class Form
{
    use ValidatesRequests;

    /**
     * The request object.
     *
     * @var Request
     */
    protected $request;

    /**
     * Form constructor.
     *
     * @param Request|null $request
     */
    public function __construct(Request $request = null)
    {
        $this->request = $request ?: request();
    }

    /**
     * Save and persist the form.
     *
     * @return bool
     */
    public function save()
    {
        $this->isValid();

        return $this->persist();
    }

    /**
     * Fetch all fields from the form.
     *
     * @return array
     */
    public function fields()
    {
        return $this->request->all();
    }

    /**
     * @return array
     */
    public function rules()
    {
        return [];
    }

    /**
     * @return array
     */
    public function labels()
    {
        return [];
    }

    /**
     * @return Request
     */
    public function request()
    {
        return $this->request;
    }

    /**
     * Persist the form.
     *
     * @return mixed
     */
    abstract public function persist();

    /**
     * Determine if the form is valid.
     *
     * @return bool
     */
    public function isValid()
    {
        $this->validate($this->request, $this->rules(), $this->labels());
    }

    /**
     * Fetch properties from the request.
     *
     * @param string $property
     *
     * @return array|string
     */
    public function __get($property)
    {
        // Consider doing a bit more checking here...

        return $this->request->input($property);
    }
}
