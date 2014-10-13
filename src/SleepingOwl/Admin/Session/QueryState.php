<?php namespace SleepingOwl\Admin\Session;

use Illuminate\Http\Request;
use Illuminate\Session\Store;

/**
 * Class QueryState
 *
 * @package SleepingOwl\Admin\Session
 */
class QueryState
{
	/**
	 * @var string
	 */
	protected $prefix;
	/**
	 * @var Store
	 */
	protected $session;
	/**
	 * @var Request
	 */
	protected $request;

	/**
	 * @param Store $session
	 * @param Request $request
	 */
	function __construct(Store $session, Request $request)
	{
		$this->session = $session;
		$this->request = $request;
	}

	/**
	 * Save current query parameters in session
	 */
	public function save()
	{
		$this->session->set($this->getSessionVarName(), $this->request->query());
	}

	/**
	 * Get saved query parameters from session
	 *
	 * @return array|null
	 */
	public function load()
	{
		return $this->session->get($this->getSessionVarName());
	}

	/**
	 * Get session name to save query parameters
	 *
	 * @return string
	 */
	protected function getSessionVarName()
	{
		$parts = [
			$this->prefix,
			'index',
			'query'
		];
		return implode('.', $parts);
	}

	/**
	 * @param string $prefix
	 */
	public function setPrefix($prefix)
	{
		$this->prefix = $prefix;
	}
} 