<?php namespace SleepingOwl\AdminAuth\Entities;

use Illuminate\Auth\UserInterface;
use Illuminate\Auth\UserTrait;

class Administrator extends \Eloquent implements UserInterface
{
	use UserTrait;

	protected $fillable = [
		'username',
		'password',
		'name',
	];

	protected $hidden = [
		'password',
		'remember_token',
	];

}