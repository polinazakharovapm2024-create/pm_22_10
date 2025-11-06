// gulpfile.js (CommonJS)
const { src, dest, series, parallel, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const terser = require('gulp-terser');                 
const sass = require('gulp-sass')(require('sass'));    
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const imagemin = require('gulp-imagemin');

const paths = {
  html: { src: 'app/**/*.html', dest: 'dist/' },
  scss: { entry: 'app/scss/style.scss', watch: 'app/scss/**/*.scss', dest: 'dist/css/' },
  js:   { src: 'app/js/**/*.js', dest: 'dist/js/' },
  img:  { src: 'app/img{,s}/**/*.{png,jpg,jpeg,svg,gif,webp}', dest: 'dist/imgs/' }
};

function html_task() {
  return src(paths.html.src)
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function scss_task() {
  return src(paths.scss.entry)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([cssnano()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

function js_task() {
  return src(paths.js.src, { sourcemaps: true })
    .pipe(concat('main.js'))
    .pipe(dest(paths.js.dest, { sourcemaps: '.' }))
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.js.dest, { sourcemaps: '.' }))
    .pipe(browserSync.stream());
}

function img_task() {
  return src(paths.img.src)
    .pipe(imagemin())
    .pipe(dest(paths.img.dest));
}

function serve(done) {
  browserSync.init({
    server: { baseDir: 'dist' },
    notify: false,
    open: true
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

function watch_task() {
  watch(paths.html.src, series(html_task, reload));
  watch(paths.scss.watch, scss_task); // ✅ слухаємо всю папку scss
  watch(paths.js.src, series(js_task, reload));
  watch(paths.img.src, series(img_task, reload));
}

const build = series(html_task, scss_task, js_task, img_task);

exports.html = html_task;
exports.scss = scss_task;
exports.js = js_task;
exports.images = img_task;
exports.build = build;
exports.default = series(build, serve, watch_task);
