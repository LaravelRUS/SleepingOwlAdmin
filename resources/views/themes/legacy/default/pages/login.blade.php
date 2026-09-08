@extends(AdminTemplate::getViewPath('_layout.base'))

@section('content')
    <div class="login-page bg-body-secondary">
        <div class="login-box">
            <div class="card card-outline card-primary">
                <div class="card-header text-center">
                    <h1 class="h3 mb-0">{{ trans('sleeping_owl::lang.auth.title') }}</h1>
                </div>
                <div class="card-body login-card-body">
                    <form action="{{ $loginPostUrl }}" method="post">
                        <input type="hidden" name="_token" value="{{ csrf_token() }}" />

                        <div class="mb-3">
                            {!! $errors->first('username', '<label for="username" class="form-label text-danger">:message</label>') !!}
                            <input type="text" name="username" id="username" class="form-control {{ $errors->has('username') ? 'is-invalid' : '' }}" placeholder="{{ trans('sleeping_owl::lang.auth.username') }}" autofocus />
                        </div>

                        <div class="mb-3">
                            {!! $errors->first('password', '<label for="password" class="form-label text-danger">:message</label>') !!}
                            <input type="password" name="password" id="password" class="form-control {{ $errors->has('password') ? 'is-invalid' : '' }}" placeholder="{{ trans('sleeping_owl::lang.auth.password') }}" />
                        </div>

                        <input type="submit" value="{{ trans('sleeping_owl::lang.auth.login') }}" class="btn btn-lg btn-success w-100" />
                    </form>
                </div>
            </div>
        </div>
    </div>
@stop
