<?php namespace SleepingOwl\Admin\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
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
			return $this->createNewAdministrator();
		}
		if ($this->option('delete'))
		{
			return $this->deleteAdministrator();
		}
		if ($this->option('password'))
		{
			return $this->changePassword();
		}
		if ($this->option('rename'))
		{
			return $this->renameAdministrator();
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
			],
			[
				'rename',
				null,
				InputOption::VALUE_NONE,
				'Change administrator name.'
			],
		];
	}

	/**
	 * Register new administrator
	 */
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
				'password' => $password,
				'name'     => $name,
			]);
		} catch (\Exception $e)
		{
			$this->error('Some error occurred. Administrator wasnt created.');
			return;
		}
		$this->info('Administrator ' . $username . ' was successfully created!');
	}

	/**
	 * Get all administrators
	 * @return array
	 */
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

	/**
	 * Render administrators list
	 */
	protected function listAdministrators()
	{
		$administrators = $this->getAdministrators();
		foreach ($administrators as $administrator)
		{
			$this->line($administrator);
		}
	}

	/**
	 * Delete administrator
	 */
	protected function deleteAdministrator()
	{
		$id = $this->selectAdministrator('Select administrator to delete:');

		$confirm = $this->confirm('Are you sure want to delete administrator with id ' . $id . '?', false);
		if ( ! $confirm) return;

		Administrator::destroy($id);
		$this->info('Administrator with id ' . $id . ' was deleted.');
	}

	/**
	 * Rename administrator
	 */
	protected function renameAdministrator()
	{
		$id = $this->selectAdministrator('Select administrator to rename:');

		$username = $this->ask('Username:');
		if (is_null($username)) return;

		$administrator = Administrator::find($id);
		$administrator->name = $username;
		$administrator->save();

		$this->info('Administrator with id ' . $id . ' was renamed.');
	}

	/**
	 * Change administrator's password
	 */
	protected function changePassword()
	{
		$id = $this->selectAdministrator('Select administrator to change password:');

		$password = $this->secret('New password:');
		if (is_null($password)) return;

		$passwordConfirm = $this->secret('Password Confirm:');
		if (is_null($passwordConfirm)) return;

		if ($password !== $passwordConfirm)
		{
			$this->error('Password confirm failed.');
			return;
		}

		Administrator::find($id)->fill(['password' => $password])->save();

		$this->info('Password was changed.');
	}

	/**
	 * Select administrator
	 * @return int
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
