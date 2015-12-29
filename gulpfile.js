'use strict';

var gulp 		= require('gulp'),
	sass 		= require('gulp-sass'),
	minifycss 	= require('gulp-minify-css'),
	rename 		= require('gulp-rename');

var config = {
    sassPath: 'static/scss',
}

gulp.task('sass', function () {
 return gulp.src('static/scss/*.scss')
        .pipe(sass({
            style: 'compressed',
            includePaths: [
                config.sassPath,
                'static/vendors/bootstrap-sass/assets/stylesheets',
            ]
        }))
        .pipe(gulp.dest('static/css'));
 });

// gulp.task('sass:watch', function () {
//   gulp.watch('./sass/**/*.scss', ['sass']);
// });