var gulp = require('gulp');
var ts = require('gulp-typescript');
var livereload = require('gulp-livereload');
var inlineNg2Template = require('gulp-inline-ng2-template');

// var result = gulp.src('./app/**/*.ts')
  // .pipe(inlineNg2Template({ base: '/app' }))
  // .pipe(tsc());
 
// return result.js
  // .pipe(gulp.dest(PATH.dest));
 
var tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', function() {
	return gulp.src('client_src/**/**/*.ts')
		.pipe( inlineNg2Template({ base: '/' }) )
		.pipe( ts(tsProject) )
		.js.pipe( gulp.dest('client_dist') )
		.pipe( livereload() );
});
 

gulp.task('watch', ['scripts'], function() {
	livereload.listen();
    gulp.watch('client_src/**/**/*.ts', ['scripts']);
});
