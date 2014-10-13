Use this command to run initial configuration of SleepingOwl Admin. It creates all necessary files and directories.

### Usage

```bash
$ php artisan admin:install --title="My Admin Title"
```

### Options

#### --title

Set title for your admin model. For details see [configuration](../Getting_Started/Configuration.html).

### What It Does

 - Publish migration for `administrator` table, migrate database and seed by default administrator (*username: `admin`, password: `SleepingOwl`*).
 - Publish [Intervention Imagecache](http://image.intervention.io/) config and set its route to `img/cache`.
 - Publish SleepingOwl Admin config and set title.
 - Publish SleepingOwl Admin assets.
 - Create bootstrap directory.
 - Create initial menu configuration file.
 - Create initial bootstrap file.
 - Create dummy user file (*as example*).
 - Create structure for public directory (*create `images`, `files` and `images/uploads` directories*).
 