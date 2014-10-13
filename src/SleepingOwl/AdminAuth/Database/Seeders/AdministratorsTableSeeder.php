<?php namespace SleepingOwl\AdminAuth\Database\Seeders;

use Hash;
use Seeder;
use SleepingOwl\AdminAuth\Entities\Administrator;

class AdministratorsTableSeeder extends Seeder
{

	public function run()
	{
		Administrator::truncate();

		$default = [
			'username' => 'admin',
			'password' => Hash::make('SleepingOwl'),
			'name'     => 'SleepingOwl Administrator'
		];

		Administrator::create($default);
	}

}