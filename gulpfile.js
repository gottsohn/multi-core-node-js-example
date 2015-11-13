let gulp = require('gulp'),
  jshint = require('jshint'),
  path = require('path'),
  source = require('vinyl-source-stream'),
  nodemon = require('gulp-nodemon'),
  mocha = require('gulp-mocha'),
  paths = {
    serverTests: ['./tests/server/**/*.spec.js'],
    styles: 'app/styles/*.+(less|css)'
  };

gulp.task('test:bend', function() {
  return gulp.src(paths.serverTests)
    .pipe(mocha({
      reporter: 'spec'
    }))
    .once('error', function() {
      process.exit(1);
    })
    .once('end', function() {
      process.exit();
    });
});

gulp.task('lint', function() {
  return gulp.src(['./index.js', +
      './server/**/*.js', './tests/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('nodemon', function() {
  nodemon({
      script: 'index.js',
      ext: 'js',
      ignore: ['public/', 'node_modules/']
    })
    .on('change', ['lint'])
    .on('restart', function() {
      console.log('>> node restart');
    });
});

gulp.task('test', ['test:bend']);
gulp.task('default', ['nodemon']);