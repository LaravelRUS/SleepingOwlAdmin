<?php namespace SleepingOwl\Admin\Commands;

use Config;
use Hash;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use SleepingOwl\Admin\Commands\Compilers\ModelCompiler;
use SleepingOwl\AdminAuth\Entities\Administrator;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class AdministratorsCommand extends Command
{
	/**
	 * The console command name.
	 * @var string
	 */
	protected $name = 'admin:administrators';

	/**
	 * The console command description.
	 * @var string
	 */
	protected $description = 'Manage your administrators.';

	/**
	 * Execute the console command.
	 * @return void
	 */
	public function fire()
	{
		if ($this->option('new'))
		{
			$this->createNewAdministrator();
			return;
		}
		if ($this->option('delete'))
		{
			$this->deleteAdministrator();
			return;
		}
		if ($this->option('password'))
		{
			$this->changePassword();
			return;
		}
		$this->listAdministrators();
	}

	/**
	 * Get the console command options.
	 * @return array
	 */
	protected function getOptions()
	{
		return [
			[
				'new',
				null,
				InputOption::VALUE_NONE,
				'Create new administrator.'
			],
			[
				'delete',
				null,
				InputOption::VALUE_NONE,
				'Delete administrator.'
			],
			[
				'password',
				null,
				InputOption::VALUE_NONE,
				'Change administrator password.'
			]
		];
	}

	protected function createNewAdministrator()
	{
		$username = $this->ask('Username:');
		if (is_null($username)) return;

		$password = $this->secret('Password:');
		if (is_null($password)) return;

		$passwordConfirm = $this->secret('Password Confirm:');
		if (is_null($passwordConfirm)) return;

		if ($password !== $passwordConfirm)
		{
			$this->error('Password confirm failed.');
			return;
		}

		$name = $this->ask('Administrator Name:');

		try
		{
			Administrator::create([
				'username' => $username,
				'password' => Hash::make($password),
				'name'     => $name,
			]);
		} catch (\Exception $e)
		{
			$this->error('Some error occurred. Administrator wasnt created.');
			return;
		}
		$this->info('Administrator ' . $username . ' was successfully created!');
	}

	protected function getAdministrators()
	{
		$administrators = Administrator::orderBy('id', 'asc')->get();
		$result = [];
		foreach ($administrators as $administrator)
		{
			$result[$administrator->id] = '<info>' . $administrator->username . '</info>: ' . $administrator->name;
		}
		return $result;
	}

	protected function listAdministrators()
	{
		$administrators = $this->getAdministrators();
		foreach ($administrators as $administrator)
		{
			$this->line($administrator);
		}
	}

	protected function deleteAdministrator()
	{
		$id = $this->selectAdministrator('Which administrator we deleting?');

		$confirm = $this->confirm('Are you sure want to delete administrator with id ' . $id . '?', false);
		if ( ! $confirm) return;

		Administrator::destroy($id);
		$this->info('Administrator with id ' . $id . ' was deleted.');
	}

	protected function changePassword()
	{
		$id = $this->selectAdministrator('Which administrator password we changing?');

		$password = $this->secret('New password:');
		if (is_null($password)) return;

		$passwordConfirm = $this->secret('Password Confirm:');
		if (is_null($passwordConfirm)) return;

		if ($password !== $passwordConfirm)
		{
			$this->error('Password confirm failed.');
			return;
		}

		Administrator::find($id)->fill(['password' => Hash::make($password)])->save();

		$this->info('Password was changed.');
	}

	/**
	 * @return mixed
	 */
	protected function selectAdministrator($message)
	{
		$administrators = $this->getAdministrators();
		$result = $this->choice($message, $administrators);
		$flipped = array_flip($administrators);
		$id = $flipped[$result];
		return $id;
	}

}
