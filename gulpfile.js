import gulp from "gulp";
import plumber from "gulp-plumber";
import less from "gulp-less";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import browser from "browser-sync";
import getData from "gulp-data";
import posthtml from "gulp-posthtml";
import twig from "gulp-twig";

// HTML

const buildHtml = () => {
  return gulp
    .src("source/layouts/pages/**/*.twig")
    .pipe(
      getData(({ path }) => {
        const page = path
          .replace(/^.*pages(\\+|\/+)(.*)\.twig$/, "$2")
          .replace(/\\/g, "/");

        return {
          page,
        };
      })
    )
    .pipe(twig())
    .pipe(posthtml())
    .pipe(gulp.dest("source"));
};

// Styles

const styles = () => {
  return gulp
    .src("source/less/style.less", { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("source/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: "source",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series(styles));
  gulp.watch("source/*.html").on("change", browser.reload);
  gulp.watch("source/layouts/**/*.twig", buildHtml);
};

export const build = gulp.parallel(buildHtml, styles);

export default gulp.series(build, server, watcher);
