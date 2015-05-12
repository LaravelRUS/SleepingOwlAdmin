<?php namespace SleepingOwl\Admin\Helpers;

use Illuminate\Contracts\Encryption\Encrypter;
use Illuminate\Http\Request;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Session\SessionManager;

class StartSession
{

	protected $encrypter;
	protected $request;
	private $manager;

	function __construct(Encrypter $encrypter, Request $request, SessionManager $manager)
	{
		$this->encrypter = $encrypter;
		$this->request = $request;
		$this->manager = $manager;
	}

	public function run()
	{
		$session = $this->startSession($this->request);
		$this->request->setSession($session);
	}

	protected function startSession(Request $request)
	{
		with($session = $this->getSession($request))->setRequestOnHandler($request);

		$session->start();

		return $session;
	}

	public function getSession(Request $request)
	{
		$session = $this->manager->driver();

		$cookie = $request->cookies->get($session->getName());
		if ( ! is_null($cookie))
		{
			$session->setId($this->encrypter->decrypt($cookie));
		}

		return $session;
	}

} 