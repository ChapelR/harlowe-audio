var gulp = require('gulp'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    del = require('del'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean-css'),
    autoprefix = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    fs = require('fs');

function processScripts (dir, out, name) {
    return gulp.src(dir)
        .pipe(concat(name))
        .pipe(uglify().on('error', function(e){
            console.log(e);
        }))
        .pipe(gulp.dest(out));
}

function processStyles (dir, out, name) {
    return gulp.src(dir)
        .pipe(concat(name))
        .pipe(clean())
        .pipe(autoprefix())
        .pipe(gulp.dest(out));
}

// linting 
function lint () {
    return gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default', { beep : true }));
}

// clean
function rimraf () {
    return del([
        './src/wrap/min.js',
        './dist/**/*'
    ]);
}

// build functions
function buildScripts () {
    var jsFiles = [
        'vendor/detect.js',
        'fast.js',
        'options.js',
        'get.js',
        'audio.js',
        'track.js',
        'group.js',
        'list.js',
        'extensions.js',
        'controlpanel.js',
        'preload.js',
        'state.js',
        'setup.js',
        'userland.js',
        'macros.js'
    ].map( function (file) {
        return './src/js/' + file;
    });
    return processScripts(jsFiles, './src/wrap', 'min.js');
}

function buildStyles () {
    var cssFiles = [
        'overlay.css',
        'panel.css',
        'slider.css'
    ].map( function (file) {
        return './src/css/' + file;
    });
    return processStyles(cssFiles, './src/wrap', 'min.css');
}

// add js wrapper
function wrapJS () {
    return gulp.src('./src/wrap/wrapper.js')
        .pipe(replace('{{version}}', require('./package.json').version))
        .pipe(replace('{{code}}', fs.readFileSync('./src/wrap/min.js', 'utf8')))
        .pipe(rename('harlowe-audio.min.js'))
        .pipe(gulp.dest('./dist'));
}

// add CSS wrapper
function wrapCSS () {
    return gulp.src('./src/wrap/wrapper.css')
        .pipe(replace('{{version}}', require('./package.json').version))
        .pipe(replace('{{code}}', fs.readFileSync('./src/wrap/min.css', 'utf8')))
        .pipe(rename('harlowe-audio.min.css'))
        .pipe(gulp.dest('./dist'));
}

// tasks
gulp.task('clean', rimraf);
gulp.task('scripts', buildScripts);
gulp.task('styles', buildStyles);
gulp.task('wrapJS', wrapJS);
gulp.task('wrapCSS', wrapCSS);
gulp.task('files', gulp.parallel('scripts', 'styles'));
gulp.task('wrap', gulp.parallel('wrapJS', 'wrapCSS'));
gulp.task('build', gulp.series('clean', 'files', 'wrap'));
gulp.task('lint', lint);