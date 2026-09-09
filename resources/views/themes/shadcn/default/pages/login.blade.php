@extends(AdminTemplate::getViewPath('_layout.base'))

@section('content')
    <main class="login-page soa-login-page">
        <section class="login-box card soa-card soa-login-card" aria-labelledby="soa-login-title">
            <header class="card-header soa-card-header soa-login-header">
                <h1 class="soa-card-title soa-login-title" id="soa-login-title">{{ trans('sleeping_owl::lang.auth.title') }}</h1>
            </header>
            <div class="card-body login-card-body soa-card-body">
                <form class="soa-auth-form" action="{{ $loginPostUrl }}" method="post">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}" />

                    <div class="soa-field">
                        {!! $errors->first('username', '<label for="username" class="soa-field-error" role="alert">:message</label>') !!}
                        <input type="text" name="username" id="username" class="form-control soa-input {{ $errors->has('username') ? 'is-invalid' : '' }}" placeholder="{{ trans('sleeping_owl::lang.auth.username') }}" autocomplete="username" @if($errors->has('username')) aria-invalid="true" @endif autofocus />
                    </div>

                    <div class="soa-field">
                        {!! $errors->first('password', '<label for="password" class="soa-field-error" role="alert">:message</label>') !!}
                        <input type="password" name="password" id="password" class="form-control soa-input {{ $errors->has('password') ? 'is-invalid' : '' }}" placeholder="{{ trans('sleeping_owl::lang.auth.password') }}" autocomplete="current-password" @if($errors->has('password')) aria-invalid="true" @endif />
                    </div>

                    <input type="submit" value="{{ trans('sleeping_owl::lang.auth.login') }}" class="btn btn-lg btn-success w-100 soa-button soa-button-success soa-login-submit" />
                </form>
            </div>
        </section>
    </main>
@stop
