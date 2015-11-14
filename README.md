Running Node JS (with Express) on Multiple Threads
==================================================

[![Code Climate](https://codeclimate.com/github/andela-gukpere/multi-core-node-js-example/badges/gpa.svg)](https://codeclimate.com/github/andela-gukpere/multi-core-node-js-example) [![Test Coverage](https://codeclimate.com/github/andela-gukpere/multi-core-node-js-example/badges/coverage.svg)](https://codeclimate.com/github/andela-gukpere/multi-core-node-js-example/coverage) [![Circle CI](https://circleci.com/gh/andela-gukpere/multi-core-node-js-example.svg?style=svg)](https://circleci.com/gh/andela-gukpere/multi-core-node-js-example) [![Build Status](https://semaphoreci.com/api/v1/projects/6523fb33-acbd-4264-ba1e-daded0c2e048/603523/badge.svg)](https://semaphoreci.com/godson/multi-core-node-js-example)


This is a simple example showing how to make NodeJS utilize your processor threads.

The example makes use of an simple Express instance for HTTP serving.

The express application can be found in `./server/app.js`, the NodeJS app useing [cluster](https://nodejs.org/api/cluster.html) to run the web server on multiple threads is the `index.js` script.

Here's a [blog post](http://blog.godson.com.ng/2015/11/running-node-js-with-express-multi-core-processors/) containing a stress test experiment with single and multi-threaded NodeJS instances.


**NOTE** For Heroku Apps you'll want to use a ratio of the threads you are provided with else you run the risk of exceeding the Memory Limit designated to your application. See below a quick example of how you could manage this with Heroku.

In line _8_ of _index.js_ you should have

```js
let numCPUs = require('os').cpus().length / (parseInt(process.env.CLUSTER_DIVIDER, 10) || 1);
```

Where _CLUSTER\_DIVIDER_ is a config variable that determines the divider to be used. For Heroku most Heroku packages (Free and Standard 1X), you get 8 threads on a **Intel(R) Xeon(R) CPU E5-2670 v2 @ 2.50GHz**, so you'll want to use a divider of **4** (meaning you use only 2 threads) to avoid consuming all 512 MB of RAM. If your plan is up to 1 GB RAM then 4 threads will be fine.

Have a look at both scripts, the comments are sure to help.