var gulp = require('gulp'),
	ts = require('gulp-typescript'),
    livereload = require('gulp-livereload');
 
var tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', function() {
	var tsResult = gulp.src('app/**/**/*.ts')
		.pipe(ts(tsProject));
	
	return tsResult.js.pipe( gulp.dest('app') ).pipe( livereload() );
});

gulp.task('watch', ['scripts'], function() {
	livereload.listen();
    gulp.watch('app/**/**/*.ts', ['scripts']);
});
