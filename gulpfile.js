'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var rimraf = require('rimraf');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var debug = require('gulp-debug');
var filter = require('gulp-filter');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var rigger = require('gulp-rigger');
var sass = require('gulp-sass');
var sftp = require('gulp-sftp');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var bower = require('main-bower-files');
var paths = {
  scss:['./scss/*.scss'],
    js:['./js/*.js'],
    html:['./form.html']
};
//html
gulp.task('form', function buildHTML(done) {
  return gulp.src('./*.html')
  .on('data', function(file){
      //console.log({ relative: file.relative, contents: file.contents });
  })
  .pipe(gulp.dest('./dist'));
  done();
});
//clean
/*gulp.task('clean', function (done) {
    return gulp.src('./dist', {read: false})
        .pipe(clean());
    done();
}); */
gulp.task('clean', function(cb){
  rimraf('./dist', cb);
});
//css 
gulp.task('scss', gulp.series('clean', function (done) {
  return gulp.src('./scss/*.scss')
    .pipe(sourcemaps.init())
	.pipe(sass({
      outputStyle: 'expanded'
	}).on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'));
    done();
}));

//rigger
gulp.task('rigger', function (done) {
    gulp.src('./js/*.js')
        .pipe(rigger())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
    done();
});
//browserSync
gulp.task('browser-sync', function(done) {
    browserSync({
        files: 'form.html, form.css',
        port: 8082
    });
    done();

});
//sftp
gulp.task('sftp', function (done) {
    return gulp.src('dist/*')
        .pipe(sftp({
            host: 'website.com',
            user: 'Dilya',
            pass: '1234'
        }));
    done();
});
//watcher
gulp.task('watch', function(done) {
    gulp.watch(paths.scss,gulp.series('scss'));
    gulp.watch(paths.js,gulp.series('rigger'));
    gulp.watch(paths.html,gulp.series('form'));
    done();
});
//build
gulp.task('build', function(done) {
  gulp.series('clean',
        gulp.parallel('form', 'scss','rigger') 
    );
    done();
});
//default
gulp.task('default', function(done){
    ['watcher', 'browser-sync', 'build']
    done();
});
    