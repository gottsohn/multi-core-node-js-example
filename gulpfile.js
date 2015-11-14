(() => {
  'use strict';
  let gulp = require('gulp'),
    jshint = require('jshint'),
    cover = require('gulp-coverage'),
    nodemon = require('gulp-nodemon'),
    mocha = require('gulp-mocha'),
    paths = {
      serverTests: ['./tests/server/**/*.spec.js']
    };

  gulp.task('test:bend', () => {
    return gulp.src(paths.serverTests)
      .pipe(cover.instrument({
        pattern: ['server/app.js'],
        debugDirectory: 'debug'
      }))
      .pipe(mocha({
        reporter: 'spec'
      }))
      .once('error', (err) => {
        throw new Error(err);
      })
      .pipe(cover.gather())
      .pipe(cover.format())
      .pipe(gulp.dest('reports'))
      .once('end', () => {
        process.exit(0);
      });
  });

  gulp.task('lint', () => {
    return gulp.src(['./index.js', +
        './server/**/*.js', './tests/**/*.js'
      ])
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
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

  gulp.task('test', ['test:bend']);
  gulp.task('default', ['nodemon']);
})();
