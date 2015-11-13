Running Node JS (with Express) on Multiple Threads
==================================================

[![Code Climate](https://codeclimate.com/github/andela-gukpere/multi-core-node-js-example/badges/gpa.svg)](https://codeclimate.com/github/andela-gukpere/multi-core-node-js-example) [![Test Coverage](https://codeclimate.com/github/andela-gukpere/multi-core-node-js-example/badges/coverage.svg)](https://codeclimate.com/github/andela-gukpere/multi-core-node-js-example/coverage)


This is a simple example showing how to make NodeJS utilize your processor threads.

The example makes use of an simple Express instance for HTTP serving.

The express application can be found in `./server/app.js`, the NodeJS app making use of cluster to run the web server on multiple threads is the `index.js` script.

Here a [blog post](http://blog.godson.com.ng/2015/11/running-node-js-with-express-multi-core-processors/) containing a stress test experiment with single and multi-threaded NodeJS instances.

Have a look at both scripts, the comments are sure to help.