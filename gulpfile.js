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

var paths = {
	srcFonts: 'src/fonts/',
    srcHtml: 'src/views/',
    srcSass: 'src/sass/',
    srcJs: 'src/js/',
    srcImg: 'src/images/',
    dirBuild: 'build/',
    dirRev: 'build/rev/',
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
    gulp.task('default', ['build']);
}

gulp.task('build', () => {
    console.log('The build task');
    // start server
    nodemonInit();
});

gulp.task('publish', () => {
    console.log('The publish task');
    // start server
    nodemonInit();
});
