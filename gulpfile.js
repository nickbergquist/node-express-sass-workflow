'use strict';

const del = require('del');
const gulp = require('gulp');
const gulpAutoprefixer = require('gulp-autoprefixer');
const gulpChanged = require('gulp-changed');
const gulpCleanCss = require('gulp-clean-css');
const gulpConcat = require('gulp-concat');
const gulpHtmlMin = require('gulp-htmlmin');
const gulpImageMin = require('gulp-imagemin');
const gulpLiveReload = require('gulp-livereload');
const gulpNodeMon = require('gulp-nodemon');
const gulpNotify = require('gulp-notify');
const gulpPlumber = require('gulp-plumber');
const gulpPug = require('gulp-pug');
const gulpRev = require('gulp-rev');
const gulpSass = require('gulp-sass');
const gulpSassLint = require('gulp-sass-lint');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpUglify = require('gulp-uglify');
const gulpUtil = require('gulp-util');

const sassOptions = {
    errLogToConsole: true
};

var paths = {
	srcFonts: 'assets/type/',
    srcSass: 'assets/sass/**/*.scss',
    srcJs: 'assets/javascripts/**/*.js',
    srcImg: 'assets/images/',
    dirBuild: 'build/',
    dirPublish: 'dist/'
};

var nodemonInit = () => {
    gulpNodeMon({
        script: './bin/www',
        ext: 'js'
    }).on('start', () => {
        console.log('Application started.');
    }).on('restart', () => {
        console.log('Application restarted.');
    }).on('crash', () => {
        console.log('Application crashed.');
        gulpNodeMon.emit('restart', 10)
    })
};

if(process.env.NODE_ENV === 'production'){
    gulp.task('default', ['publish']);
} else {
    gulp.task('default', ['build', 'watch']);
}

gulp.task('build', ['dev-css'], () => {
    console.log('The build task');
    // start server
    nodemonInit();
});

gulp.task('publish', () => {
    console.log('The publish task');
    // start server
    nodemonInit();
});

// development: compile unminified SASS with linting and sourcemaps 
gulp.task('dev-css', ['tear-down-css'], () => {
    return gulp
        .src(paths.srcSass)
        .pipe(gulpSassLint())
        .pipe(gulpSassLint.format())
        .pipe(gulpSassLint.failOnError())
        .pipe(gulpSourcemaps.init())
        .pipe(gulpSass(sassOptions).on('error', gulpSass.logError))
        .pipe(gulpAutoprefixer())
        .pipe(gulpSourcemaps.write().on('end', () => gulpUtil.log('Inline sourcemap created')))
        .pipe(gulp.dest(paths.dirBuild + 'stylesheets/').on('end', () => gulpUtil.log('Unminified CSS written to ' + paths.dirBuild + 'stylesheets/')));
});

gulp.task('tear-down-css', () => {
	return del(paths.dirBuild + 'stylesheets/*');
});

gulp.task('watch', () => {
    gulp.watch('assets/sass/**', ['dev-css']);
});
