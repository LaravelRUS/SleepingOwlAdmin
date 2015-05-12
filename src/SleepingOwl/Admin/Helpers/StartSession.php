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
		$this->request = clone $request;
		$this->manager = $manager;
	}

	public function run()
	{
		$this->decrypt($this->request);
		$session = $this->startSession($this->request);
		$this->request->setSession($session);
	}

	protected function decrypt(Request $request)
	{
		foreach ($request->cookies as $key => $c)
		{
			try
			{
				$request->cookies->set($key, $this->decryptCookie($c));
			}
			catch (DecryptException $e)
			{
				$request->cookies->set($key, null);
			}
		}

		return $request;
	}

	/**
	 * Decrypt the given cookie and return the value.
	 *
	 * @param  string|array  $cookie
	 * @return string|array
	 */
	protected function decryptCookie($cookie)
	{
		return is_array($cookie)
			? $this->decryptArray($cookie)
			: $this->encrypter->decrypt($cookie);
	}

	/**
	 * Decrypt an array based cookie.
	 *
	 * @param  array  $cookie
	 * @return array
	 */
	protected function decryptArray(array $cookie)
	{
		$decrypted = [];

		foreach ($cookie as $key => $value)
		{
			$decrypted[$key] = $this->encrypter->decrypt($value);
		}

		return $decrypted;
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

		$session->setId($request->cookies->get($session->getName()));

		return $session;
	}

} 