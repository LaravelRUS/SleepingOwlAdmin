<?php

namespace SleepingOwl\Admin\Console\Commands;

use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Console\Input\InputOption;

class UserManagerCommand extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'sleepingowl:user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Manage your users.';

    /**
     * @return null|void
     *
     * @throws \Exception
     */
    public function fire()
    {
        if ($this->option('create')) {
            $this->createNewUser();

            return;
        }

        if ($this->option('delete')) {
            $this->deleteUser();
        }

        if ($this->option('password')) {
            $this->changePassword();
        }

        $this->getUsers();
    }

    /**
     * @return null|void
     *
     * @throws \Exception
     */
    public function handle()
    {
        if ($this->option('create')) {
            $this->createNewUser();
        }

        if ($this->option('delete')) {
            $this->deleteUser();
        }

        if ($this->option('password')) {
            $this->changePassword();
        }

        $this->getUsers();
    }

    /**
     * @return string
     *
     * @throws \Exception
     */
    public function getUserClass()
    {
        if (is_null($userClass = config('auth.providers.'.config('sleeping_owl.auth_provider', 'users').'.model'))) {
            throw new Exception('User class not specified in config/auth.php providers.');
        }

        return $userClass;
    }

    /**
     * @throws \Exception
     */
    protected function getUsers()
    {
        $userClass = $this->getUserClass();

        $headers = ['id', 'name', 'email'];
        $users = $userClass::get($headers);

        $this->table($headers, $users);
    }

    /**
     * @throws \Exception
     */
    protected function createNewUser()
    {
        $userClass = $this->getUserClass();

        $email = $this->ask('Email');

        if (is_null($email)) {
            $this->error('You should specify email.');

            return;
        }

        if (! is_null($userClass::where('email', $email)->first())) {
            $this->error("User with same email [{$email}] exists.");

            return;
        }

        $password = $this->secret('Password');

        if (is_null($password)) {
            $this->error('You should specify password.');

            return;
        }

        $passwordConfirm = $this->secret('Password Confirm');

        if ($password !== $passwordConfirm) {
            $this->error('Password confirm failed.');

            return;
        }

        $name = $this->ask('User Name');

        try {
            $user = $userClass::create([
                'email' => $email,
                'password' => bcrypt($password),
                'name' => $name,
            ]);

            $this->info("User [{$user->id}] created.");
        } catch (Exception $e) {
            Log::error('unable to create new user!', [
                'exception' => $e,
            ]);
            $this->error('Something went wrong. User not created');

            return;
        }
    }

    /**
     * @throws \Exception
     */
    protected function deleteUser()
    {
        $userClass = $this->getUserClass();

        $this->getUsers();
        $id = $this->ask('Select user id to delete');

        if (is_null($user = $userClass::find($id))) {
            $this->error("User with id [{$id}] not found.");

            return;
        }

        $confirm = $this->confirm("Are you sure want to delete user with id [{$id}]?", false);
        if (! $confirm) {
            return;
        }

        $user->delete();
        $this->info("User with id [{$id}] was deleted.");
    }

    /**
     * @throws \Exception
     */
    protected function changePassword()
    {
        $userClass = $this->getUserClass();

        $this->getUsers();
        $id = $this->ask('Select user id to change their password');

        if (is_null($user = $userClass::find($id))) {
            $this->error("User with id [{$id}] not found.");

            return;
        }

        $password = $this->secret('New password');
        if (is_null($password)) {
            return;
        }

        $passwordConfirm = $this->secret('Password Confirm');
        if (is_null($passwordConfirm)) {
            return;
        }

        if ($password !== $passwordConfirm) {
            $this->error('Password confirm failed.');

            return;
        }

        $user->password = bcrypt($password);
        $user->save();

        $this->info('Password was changed.');
    }

    /**
     * Get the console command options.
     *
     * @return array
     */
    protected function getOptions()
    {
        return [
            ['create', 'c', InputOption::VALUE_NONE, 'Create new user.'],
            ['delete', 'd', InputOption::VALUE_NONE, 'Delete user.'],
            ['password', 'p', InputOption::VALUE_NONE, 'Change user password.'],
        ];
    }
}
