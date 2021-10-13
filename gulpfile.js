const project_folder = "dist";
const source_folder = "src";

const path = {
  build: {
    html: project_folder,
    css: project_folder,
    img: project_folder + "/assets/",
  },
  src: {
    html: [source_folder + "/**/index.html"],
    css: source_folder + "/**/main.scss",
    img: source_folder + "/assets/**/*.{jpg,jpeg,png,svg}",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/**/*.scss",
    img: source_folder + "/assets/**/*.{jpg,jpeg,png,svg}",
  },
  clean: "./" + project_folder + "/",
};

const { src, dest } = require("gulp"),
  gulp = require("gulp"),
  browsersync = require("browser-sync").create(),
  fileinclude = require("gulp-file-include"),
  del = require("del"),
  scss = require("gulp-sass")(require("sass")),
  imgCopy = require("gulp-copy"),
  // rename = require('gulp-rename'),
  autoprefixer = require("gulp-autoprefixer");

function images() {
  return gulp.src(path.src.img).pipe(imgCopy(path.build.img, { prefix: 2 }));
  // .pipe(browsersync.stream())
}

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "dist/",
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded",
      })
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true,
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  // gulp.watch([path.watch.img], images);
}

function claen(params) {
  return del(path.clean);
}

let build = gulp.series(claen, gulp.parallel(css, html, images));
let watch = gulp.parallel(build, watchFiles, browserSync, images);

exports.images = images;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
