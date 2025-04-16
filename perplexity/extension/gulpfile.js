import { createRequire } from "module";
import gulp from "gulp";
import gulpZip from "gulp-zip";
import process from "process";

function zip() {
  const require = createRequire(import.meta.url);
  const manifest = require("./package.json");
  const zipFileName = `${manifest.version}-${process.env.VITE_TARGET_BROWSER}.zip`;

  return gulp
    .src(`dist/${process.env.VITE_TARGET_BROWSER}/**`, {
      encoding: false,
    })
    .pipe(gulpZip(zipFileName))
    .pipe(gulp.dest("release"));
}

const createPackage = gulp.series(zip);

export { createPackage };
