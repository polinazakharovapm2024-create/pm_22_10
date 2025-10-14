const { src, dest, series, parallel, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
// const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass')(require('sass'));

const paths = {
  html:  { src: 'src/**/*.html',            dest: 'dist/' },
  scss:  { src: 'src/scss/**/*.scss', entry: 'src/scss/main.scss', dest: 'dist/css/' },
  js:    { src: 'src/js/**/*.js',           dest: 'dist/js/' },
  img:   { src: 'src/img/**/*.{png,jpg,jpeg,svg,gif,webp}', dest: 'dist/img/' }
};

function html_task() {
  return src(paths.html.src)
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function scss_task() {
  return src(paths.scss.entry)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(dest(paths.scss.dest))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

function js_task() {
  return src(paths.js.src)
    .pipe(concat('main.js'))
    .pipe(dest(paths.js.dest))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.js.dest))
    .pipe(browserSync.stream());
}

// function img_task() {
//   return src(paths.img.src)
//     .pipe(imagemin())
//     .pipe(dest(paths.img.dest));
// }

function serve() {
  browserSync.init({
    server: { baseDir: 'dist' },
    notify: false,
    open: false
  });

  watch(paths.html.src, html_task);
  watch(paths.scss.src, scss_task);
  watch(paths.js.src,   js_task);
  // watch(paths.img.src,  img_task).on('change', browserSync.reload);
}

// const build = parallel(html_task, scss_task, js_task, img_task);

const build = parallel(html_task, scss_task, js_task);

exports.html_task = html_task;
exports.scss_task = scss_task;
exports.js_task   = js_task;
// exports.img_task  = img_task;
exports.build     = build;
exports.default   = series(build, serve);

