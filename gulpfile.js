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
    return gulp.src('./src')
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
    return processScripts('./src/*.js', './src/wrap', 'min.js');
}

function buildStyles () {
    return processStyles('./src/*.css', './dist', 'harlowe-audio.min.css');
}

// add js wrapper
function wrap () {
    return gulp.src('./src/wrap/wrapper.js')
        .pipe(replace('/*** library code */', fs.readFileSync('./src/wrap/min.js', 'utf8')))
        .pipe(rename('harlowe-audio.min.js'))
        .pipe(gulp.dest('./dist'));
}

// tasks
gulp.task('clean', rimraf);
gulp.task('scripts', buildScripts);
gulp.task('styles', buildStyles);
gulp.task('files', gulp.parallel('scripts', 'styles'));
gulp.task('wrap', wrap);
gulp.task('build', gulp.series('clean', 'files', 'wrap'));
gulp.task('lint', lint);