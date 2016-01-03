'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var templateCache = require('gulp-angular-templatecache');

var config = {
    sassPath: 'static/scss',
};

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass', 'vendors', 'js', 'watch']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/dist/css/'))
    .on('end', done);
});

gulp.task('vendors', function () {
 return gulp.src(['www/lib/**/*.min.js', '!www/lib/angular/*.js', '!www/lib/ionic/**/*.js'])
        .pipe(concat('vendors.min.js'))
        .pipe(gulp.dest('www/dist/js'));
 });

gulp.task('js', ['templates'], function () {
 return gulp.src(['www/js/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('www/dist/js'));
 });

gulp.task('templates', function () {
 return gulp.src('www/templates/*.html')
        .pipe(templateCache({'standalone': true}))
        .pipe(gulp.dest('www/js'));
 });

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch('www/js/*.js', ['js']);
  gulp.watch('www/templates/*.html', ['templates', 'js']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
