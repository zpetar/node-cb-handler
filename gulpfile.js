var gulp = require('gulp'),
  jasmine = require('gulp-jasmine'),
  JasmineReporter = require('jasmine-spec-reporter'),
  debug = require('gulp-debug'),
  testsPath = './**/*.test.js';

function startTests(path) {
  path = path || testsPath;
  return gulp.src(path)
    .pipe(debug())
    .pipe(jasmine({
      reporter: new JasmineReporter()
    }));
}

gulp.task('test', function() {
  return startTests();
});

gulp.task('test:dev', function() {
  var watcher = gulp.watch(testsPath);
  watcher.on('change', function(event) {
    startTests(event.path);
  });
});
