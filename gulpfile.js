var gulp = require('gulp'),
  jasmine = require('gulp-jasmine'),
  JasmineReporter = require('jasmine-spec-reporter'),
  debug = require('gulp-debug'),
  path = require('path'),
  testsPath = './**/*.test.js',
  jsFiles = './**/*.js';

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

gulp.task('test:dev', ['test'], function() {
  var watcher = gulp.watch(jsFiles);
  watcher.on('change', function() {
    startTests();
  });
});
