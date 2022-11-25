import browser from "browser-sync";
import getData from "gulp-data";
import gulp from "gulp";
import posthtml from "gulp-posthtml";
import twig from "gulp-twig";

const buildHtml = () =>
  gulp
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

const reload = (done) => {
  browser.reload();
  done();
};

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

const watcher = () => {
  gulp.watch("source/layouts/**/*.twig", gulp.series(buildHtml, reload));
};

export default gulp.series(buildHtml, server, watcher);
