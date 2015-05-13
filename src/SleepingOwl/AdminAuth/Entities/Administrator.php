<?php namespace SleepingOwl\AdminAuth\Entities;

use Hash;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;

class Administrator extends \Eloquent implements AuthenticatableContract
{
	use Authenticatable;

	protected $fillable = [
		'username',
		'password',
		'name',
	];

	protected $hidden = [
		'password',
		'remember_token',
	];

	public function setPasswordAttribute($value)
	{
		if ( ! empty($value))
		{
			$this->attributes['password'] = Hash::make($value);
		}
	}

}