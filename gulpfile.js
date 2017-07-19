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
const gulpProcessJade = require('gulp-processjade');
const gulpPug = require('gulp-pug');
const gulpRename = require('gulp-rename');
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
    scrViews: 'assets/views/**/*.pug',
    dirViews: 'views/',
    dirBuild: 'build/',
    dirPublish: 'dist/'
};

// start/restart server/application using nodemon
const nodemonInit = () => {
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

// start server/application using node only
const nodeInit = () => {
    const exec = require('child_process').exec;
    exec('node ./bin/www', (err, stdout, stderr) => {
        if (err) {
            console.log('exec error: ' + err);
            return;
        }
        console.log(stdout);
        console.log(stderr);
    });
};

// gulp default tasks
if(process.env.NODE_ENV === 'production'){
    gulp.task('default', ['clean', 'publish']);
} else {
    gulp.task('default', ['clean', 'build', 'watch']);
}

gulp.task('build', ['build-css', 'build-pug'], () => {
    console.log('The build task');
    nodemonInit();
});

gulp.task('publish', ['pub-css', 'pub-pug'], () => {
    console.log('The publish task');
    nodeInit();
});

// development: compile unminified SASS with linting and sourcemaps 
gulp.task('build-css', ['build-tear-down-css'], () => {
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

// production: compile SASS with minification
gulp.task('pub-css', ['pub-tear-down-css'], () => {
    return gulp
        .src(paths.srcSass)
        .pipe(gulpSass(sassOptions).on('error', gulpSass.logError))
        .pipe(gulpAutoprefixer())
		.pipe(gulpCleanCss().on('end', () => gulpUtil.log('CSS minified')))
		.pipe(gulpRename('main.min.css'))
        .pipe(gulp.dest(paths.dirPublish + 'stylesheets/').on('end', () => gulpUtil.log('CSS written to ' + paths.dirPublish + 'stylesheets/')));
});

gulp.task('build-tear-down-css', () => {
	del(paths.dirBuild + 'stylesheets/*');
});

gulp.task('pub-tear-down-css', () => {
	del(paths.dirPublish + 'stylesheets/*');
});

gulp.task('tear-down-pug', () => {
	del(paths.dirViews + '/*');
});

// development: process pug templates without minified assets
gulp.task('build-pug', ['tear-down-pug'], () => {
    return gulp
        .src(paths.scrViews)
        .pipe(gulp.dest(paths.dirViews));
});

// production: process pug templates to load minified assets
gulp.task('pub-pug', ['tear-down-pug'], () => {
    return gulp
        .src(paths.scrViews)
        .pipe(gulpProcessJade())
        .pipe(gulp.dest(paths.dirViews));
});

// remove all assets
gulp.task('clean', () => {
    del([paths.dirBuild, paths.dirPublish, paths.dirViews + '/*']);
});

// development: watch tasks
gulp.task('watch', () => {
    gulp.watch('assets/sass/**', ['build-css']);
    gulp.watch('assets/views/**', ['build-pug']);
});
