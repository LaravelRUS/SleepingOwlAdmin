<?php

namespace SleepingOwl\Admin\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;

class UserManagerCommand extends Command
{

    /**
     * The console command name.
     * @var string
     */
    protected $name = 'sleepingowl:user';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'Manage your users.';

    public function fire()
    {
        if ($this->option('create')) {
            return $this->createNewUser();
        }

        if ($this->option('delete')) {
            return $this->deleteUser();
        }

        if ($this->option('password')) {
            return $this->changePassword();
        }

        $this->getUsers();
    }

    /**
     * @return string
     * @throws \Exception
     */
    public function getUserClass()
    {
        if (is_null($userClass = config('auth.providers.'.config('sleeping_owl.auth_provider', 'users').'.model'))) {
            throw new \Exception('User class not specified in config/auth.php providers.');
        }

        return $userClass;
    }

    protected function getUsers()
    {
        $userClass = $this->getUserClass();

        $headers = ['id', 'name', 'email'];
        $users   = $userClass::get($headers);

        $this->table($headers, $users);
    }

    protected function createNewUser()
    {
        $userClass = $this->getUserClass();

        if (is_null($email = $this->ask('Email'))) {
            $this->error('You should specify email.');

            return;
        }

        if (! is_null($userClass::where('email', $email)->first())) {
            $this->error("User with same email [{$email}] exists.");

            return;
        }

        if (is_null($password = $this->secret('Password'))) {
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
                'password' => $password,
                'name' => $name,
            ]);

            $this->info("User [{$user->id}] created.");
        } catch (\Exception $e) {
            $this->error('Something went wrong. User not created');

            return;
        }
    }

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
     * Change administrator's password
     */
    protected function changePassword()
    {
        $userClass = $this->getUserClass();

        $this->getUsers();
        $id = $this->ask('Select user id to delete');

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
