@extends(AdminTemplate::getViewPath('_layout.base'))

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-4 col-md-offset-4">
                <div class="login-panel panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">{{ trans('sleeping_owl::lang.auth.title') }}</h3>
                    </div>
                    <div class="panel-body">
                    	<form action="{{ $loginPostUrl }}" method="post">
                    		<input type="hidden" name="_token" value="{{ csrf_token() }}" />
                            <fieldset>
                                <div class="form-group <?=($errors->has('username')) ? 'has-error' : ''?>">
                                    {!! $errors->first('username', '<label for="username" class="control-label">:message</label>') !!}
                                    <input type="text" name="username" id="username" class="form-control" placeholder="{{ trans('sleeping_owl::lang.auth.username') }}" autofocus />
                                </div>
                                <div class="form-group <?=($errors->has('password')) ? 'has-error' : ''?>">
                                    {!! $errors->first('password', '<label for="password" class="control-label">:message</label>') !!}
                                    <input type="password" name="password" id="password" class="form-control" placeholder="{{ trans('sleeping_owl::lang.auth.password') }}" />
                                </div>
                                <input type="submit" value="{{ trans('sleeping_owl::lang.auth.login') }}" class="btn btn-lg btn-success btn-block" />
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop
