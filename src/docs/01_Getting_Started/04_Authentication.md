SleepingOwl Admin uses own authentication method. You can use native laravel authentication or any other in your frontend.

Administrators separated from any other users of your website and stores in `administrators` database table. Any administrator can access admin module, but nobody else.

### Default Credentials

Default username/password is `admin` / `SleepingOwl`.

### Manage Administrators

You can manage your administrators with [administrators command](../Commands/Administrators.html).

### Logined Administrator

You can get current logined administrator using `AdminAuth::user()`.