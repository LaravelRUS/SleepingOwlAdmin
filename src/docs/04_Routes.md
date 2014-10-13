SleepingOwl admin module creates RESTful-style controller for your models.

Additional routes, that will be registered (*you could use it in your code as well if you need*):

URI                         | Method | Name 
--------------------------- | :----: | -----------------------
admin/login                 | get    | sleeping-owl-admin.login
admin/login                 | post   | sleeping-owl-admin.login.post
admin/logout                | get    | sleeping-owl-admin.logout
admin                       | get    | sleeping-owl-admin.home
admin/{model}               | get    | sleeping-owl-admin.table.table
admin/{model}/create        | get    | sleeping-owl-admin.table.create
admin/{model}               | post   | sleeping-owl-admin.table.store
admin/{model}/{id}/edit     | get    | sleeping-owl-admin.table.edit
admin/{model}/{id}/update   | put    | sleeping-owl-admin.table.update
admin/{model}/{id}          | delete | sleeping-owl-admin.table.destroy
admin/{model}/{id}/moveup   | patch  | sleeping-owl-admin.table.moveup
admin/{model}/{id}/movedown | patch  | sleeping-owl-admin.table.movedown
admin/js/{locale}/lang.js   | get    | sleeping-owl-admin.lang
images/all                  | get    | &nbsp;
images/upload               | post   | &nbsp;

 - *All routes, except `admin/login` and `admin/logout`, use before filter (`admin.auth` is default).*
 - *All routes with `post`, `put`, `patch`, `delete` methods have `csrf` before filter.*
 - *You can change url prefix in config (`admin` is default). See [configuration page](Getting_Started/Configuration.html).*
