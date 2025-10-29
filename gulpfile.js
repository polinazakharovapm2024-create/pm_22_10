const {src, dest, series, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass')(require('sass'));

const paths = {
    html: {
        src: 'app/**/*.html',
        dest: 'dist'
    },
    scss: {
        src: 'app/scss/**/*.scss',
        dest: 'dist/css/'
    },
    js: {
        src: 'app/js/**/*.js',
        dest: 'dist/js/'
    },
    img: {
        src: 'app/img{,s}/**/*.{png,jpg,jpeg,svg,gif,webp}',
        dest: 'dist/imgs'
    }
};

function html_task() {
    return src(paths.html.src)
        .pipe(dest(paths.html.dest));
}

function scss_task() {
    return src(paths.scss.src)
        .pipe(concat('main.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(dest(paths.scss.dest));
}

function js_task() {
    return src(paths.js.src)
        .pipe(concat('main.js'))
        .pipe(dest(paths.js.dest))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(dest(paths.js.dest));
}

function img_task() {
    return src(paths.img.src)
        .pipe(imagemin())
        .pipe(dest(paths.img.dest));
}

function serve() {
    browserSync.init({
        server: {baseDir: 'dist'},
        notify: false,
        open: true
    });
}

function reload() {
    browserSync.reload();
}

function watch_task() {
    watch(paths.html.src, series(html_task, reload));
    watch(paths.scss.src, series(scss_task, reload));
    watch(paths.js.src, series(js_task, reload));
    watch(paths.img.src, series(img_task, reload));
}

const build = series(html_task, scss_task, js_task, img_task);

exports.default = series(build, serve, watch_task);