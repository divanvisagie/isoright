/******************************************************************************
 * Gulpfile
 * Be sure to run `npm install` for `gulp` and the following tasks to be
 * available from the command line. All tasks are run using `gulp taskName`.
 ******************************************************************************/
var gulp = require('gulp');
var del = require('del');
var path = require('path');
var config = require('./ionic.config');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var karma = require('karma').Server;

// typescript files are compiled individually and saved to www/build/test/ - delete them here
gulp.task('test.clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del([config.paths.test.dest]);
});

// run tslint against all typescript
gulp.task('test.lint', function () {
  gulp.src(config.paths.test.app)
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('test.copyHTML', ['test.clean'], function() {
  gulp.src(config.paths.html.src).pipe(gulp.dest(config.paths.test.dest));
});

// compile typescript into indivudal files, project directoy structure is replicated under www/build/test
gulp.task('test.compile', ['test.clean'], function () {

  var tsProject = ts.createProject(
    './tsconfig.json',
    { typescript: require('typescript') }
  );

  var tsResult = gulp.src([
    config.paths.test.app,
    config.paths.test.stub,
    config.paths.test.typings
  ])
  .pipe(ts(tsProject))
  .pipe(gulp.dest(config.paths.test.dest));

  return tsResult;
});

// run jasmine unit tests using karma - lint and compile are run in parallel
gulp.task('test', ['test.lint', 'test.compile', 'test.copyHTML'], function() {

  karma.start({
    configFile: __dirname + '/' + config.paths.test.config,
  }, function(karmaExitCode) {
    // https://github.com/meanjs/mean/issues/873
    // there are some issues with karma hanging for 30 seconds when invoked by gulp..
    // process.exit is dirty enough but does the trick for now
    console.log('karma exited with ' + karmaExitCode);
    process.exit(karmaExitCode);
  });
});
