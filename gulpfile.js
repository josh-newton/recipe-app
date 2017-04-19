/* eslint-disable */

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var compass = require('gulp-compass');
var ngAnnotate = require('gulp-ng-annotate');
var autoprefixer = require('gulp-autoprefixer');
var karma = require('karma').server;
var merge = require('merge-stream');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

gulp.task('compass', function() {
  return gulp.src('app/styles/**/*.scss')
    .pipe(plumber(function (error) {
        gutil.log(error.message);
        this.emit('end');
    }))
    .pipe(compass({
      css: '.tmp/styles',
      sass: 'app/styles'
    }))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('test', function (done) {
  return karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('html', ['compass'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/**/*.html')
    .pipe(assets)
    .pipe($.if('*.js', ngAnnotate()))
    // .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  var images = gulp.src('app/images/*')
  .pipe(gulp.dest('dist/images/'));
  return merge(images);
});

gulp.task('fonts', function () {
  return gulp.src('app/bower_components/**/*.{eot,svg,ttf,woff,woff2}').pipe(gulp.dest('dist/bower_components'));
});

gulp.task('extras', function () {
  var manifest = gulp.src('manifest.json', {dot: true}).pipe(gulp.dest('dist/'));
  return merge(manifest);
});

gulp.task('data', function () {
  var data = gulp.src('app/data/*.json').pipe(gulp.dest('dist/data'));
});

gulp.task('clean', function() {
  require('del').bind(null, ['.tmp', 'dist/*', 'dist']);
});

gulp.task('serve', ['compass', 'fonts'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app']
    }
  });

  // watch for changes
  gulp.watch([
    'app/**/*.html',
    'app/scripts/**/**/*.{js,html}',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/*.scss', ['compass']);
  gulp.watch('app/scripts/**/**/*.scss', ['compass']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass-official'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['clean', 'html', 'images', 'fonts', 'data', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build'}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
