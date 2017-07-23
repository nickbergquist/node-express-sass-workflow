'use strict';

const del = require('del');
const gulp = require('gulp');
const gulpAutoprefixer = require('gulp-autoprefixer');
const gulpCleanCss = require('gulp-clean-css');
const gulpConcat = require('gulp-concat');
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

// gulp-plumber syntax error details
const onError = (err) => {  
    gulpUtil.beep();
    console.log(err.toString());
};

const paths = {
	srcFonts: 'assets/type/*',
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
        gulpUtil.log(gulpUtil.colors.cyan('Application started.'));
    }).on('restart', () => {
        gulpUtil.log(gulpUtil.colors.cyan('Application restarted.'));
    }).on('crash', () => {
        gulpUtil.log(gulpUtil.colors.red('Application crashed.'));
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

gulp.task('build', ['build-css', 'build-pug', 'build-fonts', 'build-js'], () => {
    gulpUtil.log(gulpUtil.colors.green('Application built'));
    nodemonInit();
});

gulp.task('publish', ['pub-css', 'pub-pug', 'pub-fonts', 'pub-js'], () => {
    gulpUtil.log(gulpUtil.colors.green('Application published. No watch on assets'));
    nodeInit();
});

// remove all processed assets
gulp.task('clean', () => {
    del([paths.dirBuild, paths.dirPublish, paths.dirViews]);
});

// development: watch tasks
gulp.task('watch', () => {
    gulp.watch(paths.srcSass, ['build-css']);
    gulp.watch(paths.scrViews, ['build-pug']);
    gulp.watch(paths.srcJs, ['build-js']);
});


// CSS files
// development: compile unminified SASS with linting and sourcemaps 
gulp.task('build-css', ['build-tear-down-css'], () => {
    return gulp
        .src(paths.srcSass)
        .pipe(gulpPlumber({
            errorHandler: onError
        }))
        .pipe(gulpSassLint())
        .pipe(gulpSassLint.format())
        .pipe(gulpSassLint.failOnError())
        .pipe(gulpSourcemaps.init())
        .pipe(gulpSass(sassOptions).on('error', gulpSass.logError))
        .pipe(gulpAutoprefixer())
        .pipe(gulpSourcemaps.write().on('end', () => gulpUtil.log('Inline CSS sourcemap created')))
        .pipe(gulp.dest(paths.dirBuild + 'stylesheets/').on('end', () => gulpUtil.log('Unminified CSS written to ' + paths.dirBuild + 'stylesheets/')));
});

// development: remove processed CSS
gulp.task('build-tear-down-css', () => {
	del(paths.dirBuild + 'stylesheets/*');
});

// production: compile SASS with minification
gulp.task('pub-css', () => {
    return gulp
        .src(paths.srcSass)
        .pipe(gulpSass(sassOptions).on('error', gulpSass.logError))
        .pipe(gulpAutoprefixer())
		.pipe(gulpCleanCss().on('end', () => gulpUtil.log('CSS minified')))
		.pipe(gulpRename('main.min.css'))
        .pipe(gulp.dest(paths.dirPublish + 'stylesheets/').on('end', () => gulpUtil.log('CSS written to ' + paths.dirPublish + 'stylesheets/')));
});


// PUG files
// development: simple copy of pug templates without minified assets
gulp.task('build-pug', ['tear-down-pug'], () => {
    return gulp
        .src(paths.scrViews)
        .pipe(gulp.dest(paths.dirViews).on('end', () => gulpUtil.log('Views processed and written to ' + paths.dirViews)));
});

// production: process pug templates to load minified assets
gulp.task('pub-pug', ['tear-down-pug'], () => {
    return gulp
        .src(paths.scrViews)
        .pipe(gulpProcessJade())
        .pipe(gulp.dest(paths.dirViews).on('end', () => gulpUtil.log('Views processed and written to ' + paths.dirViews)));
});

// remove all processed views - same for development and production at present
gulp.task('tear-down-pug', () => {
	del(paths.dirViews + '/*');
});


// JAVASCRIPT files
// development: process javascripts
gulp.task('build-js', ['build-tear-down-js'], () => {
    return gulp
        .src(paths.srcJs)
        .pipe(gulp.dest(paths.dirBuild + 'javascripts/').on('end', () => gulpUtil.log('Javascripts written to ' + paths.dirBuild + 'javascripts/')));
});

// development: remove javascripts
gulp.task('build-tear-down-js', () => {
	return del(paths.dirBuild + 'javascripts/*');
});

// production: process javascripts - concatenate and minify
gulp.task('pub-js', () => {
    return gulp
        .src(['assets/javascripts/static/matchMedia.js', 'assets/javascripts/static/enquire.min.js', 'assets/javascripts/site.js'])
        .pipe(gulpConcat('site.min.js'))
		.pipe(gulpUglify())
        .pipe(gulp.dest(paths.dirPublish + 'javascripts/').on('end', () => gulpUtil.log('Concatenated and minified Javascripts written to ' + paths.dirPublish + 'javascripts/')));
});


// FONT files
// development: process fonts - simple copy
gulp.task('build-fonts', () => {
    return gulp
        .src(paths.srcFonts)
        .pipe(gulp.dest(paths.dirBuild + 'type/').on('end', () => gulpUtil.log('Fonts written to ' + paths.dirBuild + 'type/')));
});

// production: process fonts - simple copy
gulp.task('pub-fonts', () => {
    return gulp
        .src(paths.srcFonts)
        .pipe(gulp.dest(paths.dirPublish + 'type/').on('end', () => gulpUtil.log('Fonts written to ' + paths.dirPublish + 'type/')));
});
