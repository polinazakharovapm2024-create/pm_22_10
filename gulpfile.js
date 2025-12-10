const { src, dest, series, parallel, watch } = require("gulp");
const fileinclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const fs = require("fs");

const paths = {
  html: {
    src: "src/index.html",
    watch: "src/**/*.html",
    dest: "dist/"
  },
  styles: {
    src: "src/scss/main.scss",
    watch: "src/**/*.scss",
    dest: "dist/css/"
  },
  scripts: {
    src: ["src/js/**/*.js", "!src/js/**/*.min.js"],
    watch: "src/js/**/*.js",
    dest: "dist/js/"
  },
  images: {
    src: "src/imgs/**/*",
    dest: "dist/imgs/"
  },
  data: {
    src: "src/data/**/*",
    dest: "dist/data/"
  }
};

const bootstrapPaths = {
  css: "node_modules/bootstrap/dist/css/bootstrap.min.css",
  js: "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
};

function clean(cb) {
  try {
    fs.rmSync("dist", { recursive: true, force: true });
  } catch (e) {
  }
  cb();
}

// HTML + fileinclude
function html() {
  return src(paths.html.src)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file"
      })
    )
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// SCSS -> CSS + мініфікація
function styles() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(cssnano())
    .pipe(concat("index.min.css"))
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return src(paths.scripts.src)
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

function images() {
  return src("src/imgs/**/*.{jpg,jpeg,png,svg,webp,gif}", { 
    allowEmpty: true, 
    encoding: false // Це налаштування критичне для Gulp 5+
  })
    .pipe(dest("dist/imgs"))
    .pipe(browserSync.stream());
}

function data() {
  return src(paths.data.src, { allowEmpty: true }).pipe(dest(paths.data.dest));
}

function bootstrapCss() {
  return src(bootstrapPaths.css).pipe(dest("dist/css/"));
}
function bootstrapJs() {
  return src(bootstrapPaths.js).pipe(dest("dist/js/"));
}

function serve() {
  browserSync.init({
  server: {
    baseDir: "dist/",
    routes: {
      "/imgs": "dist/imgs" 
    }
}

  });

  watch(paths.html.watch, html);
  watch(paths.styles.watch, styles);
  watch(paths.scripts.watch, scripts);
  watch(paths.images.src, images);
  watch(paths.data.src, data);
}


const build = series(
  clean,
  parallel(html, styles, scripts, images, data, bootstrapCss, bootstrapJs)
);

exports.build = build;
exports.default = series(build, serve);
exports.bootstrapCss = bootstrapCss;
exports.bootstrapJs = bootstrapJs;
exports.data = data;
