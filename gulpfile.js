var gulp = require('gulp');
var ts = require('gulp-typescript');
// var livereload = require('gulp-livereload');
var inlineNg2Template = require('gulp-inline-ng2-template');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
// var stripDebug = require('strip-debug');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
// var copy = require('gulp-copy');
// var tslint = require('gulp-tslint');
// var result = gulp.src('./app/**/*.ts')
  // .pipe(inlineNg2Template({ base: '/app' }))
  // .pipe(tsc());
 
// return result.js
  // .pipe(gulp.dest(PATH.dest));
  /*    "gulp-tslint": "^4.3.3",
  
    "strip-debug": "^1.1.1",*/
	
var appTsSrc = 'client_src/**/**/*.ts';
 /* 
gulp.task('tslint', function() {
  return gulp.src(appTsSrc)
    .pipe( tslint() )
    .pipe( tslint.report('verbose') );
}); */ 



gulp.task('app', function() {
	var tsProject = ts.createProject('tsconfig.json', {
		typescript: require('typescript'),
		outFile: 'app.js'
	});
	
	return gulp.src(appTsSrc)
		.pipe( sourcemaps.init() )
		.pipe( inlineNg2Template(/*{ useRelativePaths: true }*/) )
		.pipe( ts(tsProject) )
		// .pipe( stripDebug() )
		// .pipe( concat('app.js') )
		.pipe( uglify({ mangle: false }) )
		.pipe( sourcemaps.write('.') )
		//.js
		.pipe( gulp.dest('public/js') );
		//.pipe( livereload() );
});

gulp.task('dev_app', function() {
	var tsProject = ts.createProject('tsconfig.json', {
		typescript: require('typescript')
	});
	
	return gulp.src(appTsSrc)
		.pipe( ts(tsProject) )
		.pipe( gulp.dest('client_compiled') );
});

gulp.task('libs', function() {
	return gulp.src([
		'node_modules/systemjs/dist/system-polyfills.js',
		'node_modules/systemjs/dist/system.js',
		'node_modules/es6-shim/es6-shim.js',
		'node_modules/rxjs/bundles/Rx.js',
		'node_modules/angular2/bundles/angular2-polyfills.js',
		'node_modules/angular2/bundles/angular2.dev.js',
		'node_modules/angular2/bundles/router.dev.js',
		'node_modules/angular2/bundles/http.dev.js'
	])
	.pipe( uglify({ mangle: false }) )
	.pipe( concat('libs.js') )
	.pipe( gulp.dest('public/js') );
});

gulp.task('copy:system', function() {
	return gulp.src('node_modules/systemjs/dist/system.js')
		.pipe( gulp.dest('public/js') );
});

gulp.task('copy:fonts', function() {
	return gulp.src('node_modules/bootstrap/dist/fonts/*')
		.pipe( gulp.dest('public/fonts') );
});

gulp.task('css', function() {
	return gulp.src([
		'node_modules/bootstrap/dist/css/bootstrap.css',
		'public/css/src/**/*.css'
	])
	.pipe( sourcemaps.init() )
	.pipe( concat('style.css') )
	.pipe( cleanCSS() )
	.pipe( sourcemaps.write('.') )
	.pipe( gulp.dest('public/css') );
});

gulp.task('build', ['app', 'libs', 'copy:system', 'css', 'copy:fonts']);

gulp.task('watch', ['dev_app'], function() {
	// livereload.listen();
    gulp.watch('client_src/**/**/*', ['dev_app']);
});

// sudo service nginx restart && sudo pm2 restart www









