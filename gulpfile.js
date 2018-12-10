var gulp = require('gulp');

// JS
var babel = require('gulp-babel');

// styles
var sass = require('gulp-sass');
var sassGl = require('gulp-sass-glob');
var prefix = require('gulp-autoprefixer');

// html
var html = require('gulp-html-minifier');

// server
var live = require('gulp-live-server');

// other
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var error      = require('gulp-prettyerror');

// Errors
var onError = function (err) {
  console.log(err);
  this.emit('end');
};

// Paths
var path = {
  dist: './build/',
  base: './src/',
  scss: './src/scss/**/*',
  styles: [
    './src/scss/_main.scss'
  ],
  copy: [
    './src/browserconfig.xml',
    './src/manifest.json',
    './src/img/**/*',
    './src/svg/**/*',
    './src/fonts/**/*',
    './src/favicon/**/*'
  ],
  html: [
    './src/*.html',
  ],
  scripts: [
    './src/js/jquery.js',
    './src/js/jqpuzzle.js',
    './src/js/main.js',
  ]
};

// SASS
gulp.task('scss', function () {
  gulp
    .src(path.styles)
    .pipe(concat('style.css '))
    .pipe(sassGl())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(
      prefix({
        remove: false,
        browsers: ['last 3 versions', '> 1%', 'Firefox > 0', 'ie 9']
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.dist + '/css'));
});

// JS
gulp.task('js',function () {
    gulp
      .src(path.scripts)
      .pipe(error())
      .pipe(sourcemaps.init())
      .pipe(babel({
          presets: ['env']
      }))
      .pipe(concat('bundle.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.dist + 'js'));
});

gulp.task('html', function() {
  gulp.src(path.html)
    .pipe(html({collapseWhitespace: true}))
    .pipe(gulp.dest(path.dist));
});

// Copy
gulp.task('copy', function () {
  gulp
    .src(path.copy, { base: './src/' })
    .pipe(gulp.dest(path.dist));
});

// Watch
gulp.task('watch', function () {
  gulp.watch(path.scss, ['scss']);
  gulp.watch(path.scripts, ['js']);
  gulp.watch(path.html, ['html']);
});

// Server
gulp.task('serve', function () {
  var server = live.static('./build', 3000);
  server.start();

  // Array with monitored folder paths
  gulp.watch(['build/**/*'], function (file) {
    server.notify.apply(server, [file]);
  });
});

// Gulp
gulp.task('build', ['scss', 'js', 'html', 'copy']);
gulp.task('live', ['watch', 'serve']);
gulp.task('default', ['live', 'build']);
