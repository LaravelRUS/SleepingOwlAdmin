@extends('admin::_layout.base')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-4 col-md-offset-4">
                <div class="login-panel panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">{{ Lang::get('admin::lang.auth.title') }}</h3>
                    </div>
                    <div class="panel-body">
                        {!! Form::open(['url' => $loginPostUrl]) !!}
                            <fieldset>
                                <div class="form-group <?=($errors->has('username')) ? 'has-error' : ''?>">
                                    {!! $errors->first('username', Form::label('username', ':message', ['class' => 'control-label'])) !!}
                                    {!! Form::text('username', null, ['class' => 'form-control', 'placeholder' => Lang::get('admin::lang.auth.username'), 'autofocus']) !!}
                                </div>
                                <div class="form-group <?=($errors->has('password')) ? 'has-error' : ''?>">
                                    {!! $errors->first('password', Form::label('password', ':message', ['class' => 'control-label'])) !!}
                                    {!! Form::password('password', ['class' => 'form-control', 'placeholder' => Lang::get('admin::lang.auth.password')]) !!}
                                </div>
                                {!! Form::button(Lang::get('admin::lang.auth.login'), ['class' => 'btn btn-lg btn-success btn-block', 'type' => 'submit']) !!}
                            </fieldset>
                        {!! Form::close() !!}
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop