const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const jade = require('gulp-jade');
const cssmin = require('gulp-cssmin');
const jsmin = require('gulp-jsmin');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const cssbeautify = require('gulp-cssbeautify');

gulp.task('buildcss', function() {
	gulp.src('app/sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(autoprefixer())
    .pipe(concat('app.css'))
    .pipe(cssbeautify({
      indent: '  ',
      autosemicolon: true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./static/css/'));
});


gulp.task('builhtml', function() {
  var YOUR_LOCALS = {};
 
  gulp.src('app/view/*.jade')
    .pipe(jade({
        pretty: true
    }))
    .pipe(gulp.dest('./static/'));
});

gulp.task('mincss', ['buildcss'], function() {
  gulp.src('app/sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(concat('app.css'))
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./static/css/'));
});


gulp.task('libsjs', function() {
  return gulp.src(['app/js/libs/*.js', 'bower_components/slick-carousel/slick/slick.js', 'bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js'])
    .pipe(concat({ path: 'libs.js', stat: { mode: 0666 }}))
    .pipe(gulp.dest('./static/js/libs/'));
});

gulp.task('appjs', function() {
  return gulp.src(['app/js/plugins/*.js', 'app/js/app.js'])
    .pipe(concat({ path: 'app.js', stat: { mode: 0666 }}))
    .pipe(gulp.dest('./static/js/'));
});

gulp.task('minlibsjs', function() {
  return gulp.src(['app/js/libs/*.js', 'bower_components/slick-carousel/slick/slick.js', 'bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js'])
    .pipe(concat({ path: 'libs.js', stat: { mode: 0666 }}))
    .pipe(jsmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/js/libs/'));
});

gulp.task('minappjs', function() {
  return gulp.src(['app/js/plugins/*.js', 'app/js/app.js'])
    .pipe(concat({ path: 'app.js', stat: { mode: 0666 }}))
    .pipe(jsmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/js/'));
});


gulp.task('imagemin', function () {
  gulp.src('app/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./static/images'));
});

gulp.task('express', function() {
  var express = require('express');
  var app = express();

  app.use(require('connect-livereload')({port: 35729}));
  app.use(express.static(__dirname + '/static'));
  app.listen(4000, '0.0.0.0');
});

var tinylr;

gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(35729);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname + '/static', event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}


gulp.task('watch', function() {
  gulp.watch(['app/sass/**/*.scss', 'app/view/**/*.jade', 'app/js/plugins/*.js', 'app/js/app.js'],['buildcss', 'builhtml', 'appjs']);
  gulp.watch('static/*.html', notifyLiveReload);
  gulp.watch('static/css/*.css', notifyLiveReload);
  gulp.watch('./static/js/*.js', notifyLiveReload);
});

gulp.task('default', ['express', 'buildcss', 'builhtml', 'libsjs', 'appjs', 'imagemin', 'livereload','watch'], function(){});
gulp.task('release', ['buildcss', 'mincss', 'builhtml', 'minlibsjs', 'minappjs', 'imagemin'], function(){});

