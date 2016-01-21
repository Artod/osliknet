var gulp = require('gulp');
var ts = require('gulp-typescript');
 
var tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', function() {
	var tsResult = gulp.src('app/**/*.ts')
		.pipe(ts(tsProject));
	
	return tsResult.js.pipe(gulp.dest('app'));
});

gulp.task('watch', ['scripts'], function() {
    gulp.watch('app/**/*.ts', ['scripts']);
});