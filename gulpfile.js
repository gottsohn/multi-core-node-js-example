(() => {
  'use strict';
  const ENV = process.env.NODE_ENV || 'development';
  if (ENV === 'development') {
    require('dotenv').load();
  }

  let gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    reporter = require('gulp-codeclimate-reporter'),
    istanbul = require('gulp-istanbul'),
    nodemon = require('gulp-nodemon'),
    mocha = require('gulp-mocha'),
    paths = {
      serverTests: ['./tests/*.spec.js'],
      app: ['./server/*.js']
    };


  gulp.task('pre-test', () => {
    return gulp.src(paths.app)
      .pipe(istanbul())
      .pipe(istanbul.hookRequire());
  });

  gulp.task('test:server', ['pre-test'], () => {
    return gulp.src(paths.serverTests)
      .pipe(mocha({
        reporter: 'spec'
      }))
      .once('error', err => {
        throw new Error(err);
      })
      .pipe(istanbul({
        includeUntested: true
      }))
      .pipe(istanbul.writeReports({
        dir: './coverage',
        reporters: ['lcov'],
        reportOpts: {
          dir: './coverage'
        }
      }))
      .once('end', () => {});
  });

  gulp.task('lint', () => {
    return gulp.src(['./index.js', 'gulpfile.js',
        './server/**/*.js', './tests/**/*.js'
      ])
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
  });

  gulp.task('codeclimate-reporter', ['test:server'], () => {
    return gulp.src('coverage/lcov.info', {
        read: false
      })
      .pipe(reporter({
        token: process.env.CODECLIMATE_TOKEN,
        verbose: true
      }));
  });

  gulp.task('nodemon', () => {
    nodemon({
        script: 'index.js',
        ext: 'js',
        ignore: ['public/', 'node_modules/']
      })
      .on('change', ['lint'])
      .on('restart', () => {
        console.log('>> node restart');
      });
  });

  gulp.task('test', ['codeclimate-reporter']);
  gulp.task('default', ['nodemon']);
})();
