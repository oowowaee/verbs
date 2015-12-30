'use strict';

var gulp 		= require('gulp'),
	sass 		= require('gulp-sass'),
	minifycss 	= require('gulp-minify-css'),
	rename 		= require('gulp-rename'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify');

var config = {
    sassPath: 'static/scss',
}

gulp.task('sass', function () {
 return gulp.src('static/scss/*.scss')
        .pipe(sass({
            style: 'compressed',
            includePaths: [
                'static/vendors/bootstrap-sass/assets/stylesheets',
            ]
        }))
        .pipe(gulp.dest('static/dist/css'));
 });

gulp.task('vendors', function () {
 return gulp.src(['static/vendors/**/*.min.js', '!static/vendors/jquery/**/*.min.js', '!static/vendors/bootstrap-sas/**/*.min.js'])
        .pipe(concat('vendors.min.js'))
        .pipe(gulp.dest('static/dist/js'));
 });

gulp.task('js', function () {
 return gulp.src('static/js/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('static/dist/js'));
 });


gulp.task('default', ['sass', 'vendors', 'js'], function() {
  gulp.watch('static/scss/*.scss', ['sass']);
  gulp.watch('static/js/*.js', ['js']);
});