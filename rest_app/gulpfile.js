'use strict';

var gulp 		  = require('gulp'),
	sass 		    = require('gulp-sass'),
	minifycss 	= require('gulp-minify-css'),
	rename 		  = require('gulp-rename'),
  concat      = require('gulp-concat'),
  uglify      = require('gulp-uglify'),
  templateCache = require('gulp-angular-templatecache');

var config = {
  sassPath: 'static/scss',
};

gulp.task('sass', function () {
 return gulp.src('static/scss/*.scss')
        .pipe(sass({
            style: 'compressed',
            includePaths: [
              'static/vendors/components-font-awesome/scss',
              'static/vendors/bootstrap-sass/assets/stylesheets',
              'static/vendors/angular-ui-notification/dist'
            ]
        }))
        .pipe(gulp.dest('static/dist/css'));
 });

gulp.task('vendors', function () {
 return gulp.src(['static/vendors/**/*.min.js', 
                  '!static/vendors/angular/**/*.js', 
                  '!static/vendors/jquery/**/*.min.js', 
                  '!static/vendors/bootstrap-sass/**/*.min.js'])
        .pipe(concat('vendors.min.js'))
        .pipe(gulp.dest('static/dist/js'));
 });

gulp.task('js', ['templates'], function () {
 return gulp.src(['static/js/*.js', 
                  '../ionic_app/www/js/constants.js',
                  '../ionic_app/www/js/factories.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('static/dist/js'));
 });

gulp.task('templates', function () {
 return gulp.src('static/templates/*.html')
        .pipe(templateCache({'standalone': true, moduleSystem: 'IIFE'}))
        .pipe(gulp.dest('static/js'));
 });

gulp.task('watch', ['sass', 'vendors', 'js'], function() {
  gulp.watch('static/scss/*.scss', ['sass']);
  gulp.watch('static/js/*.js', ['js']);
  gulp.watch('../ionic_app/www/js/constants.js', ['js']);
  gulp.watch('../ionic_app/www/js/factories.js', ['js']);
  gulp.watch('static/templates/*.html', ['js']);
});

gulp.task('default', ['watch']);