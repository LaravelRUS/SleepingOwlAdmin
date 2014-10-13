var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var concatCSS = require('gulp-concat-css');
var minifyCSS = require('gulp-minify-css');
var notify = require('gulp-notify');

var src = './resources/';
var dest = './public/';
gulp.task('css', function () {
	gulp.src(src + 'css/*.css')
		.pipe(concatCSS('all.min.css'))
		.pipe(minifyCSS({keepSpecialComments:0}))
		.pipe(gulp.dest(dest))
		.pipe(notify('Minified CSS created.'));
});

gulp.task('js', function () {
	gulp.src([src + 'js/jquery-1.11.0.js', src + 'js/plugins/**/*.js', src + 'js/*.js'])
		.pipe(concat('all.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(dest))
		.pipe(notify('Minified JS created.'));
});

gulp.task('default', function () {
	gulp.run(['js', 'css']);
	gulp.watch(src + 'js/*.js', ['js']);
	gulp.watch(src + 'css/*.css', ['css']);
});