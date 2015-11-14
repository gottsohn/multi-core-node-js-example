(() => {
  'use strict';
  const ENV = process.env.NODE_ENV || 'development';
  let express = require('express'),
    cluster = require('cluster'),
    moment = require('moment'),
    app = express(),
    bodyParser = require('body-parser');

  module.exports = (appdir, cb) => {
    app.dir = appdir;

    // static files
    app.use(express.static(app.dir + '/public'));

    // things to do on each request
    app.use((req, res, next) => {
      // log each request in development/staging ENVironment
      if (ENV !== 'production') {
        console.log(moment().format('HH:MM'), req.method, req.url, req.socket.bytesRead, 'process:', process.pid);
      }
      next();
    });

    // Standard error handling
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
      next();
    });

    // to support JSON-encoded bodies
    app.use(bodyParser.json());

    // to support URL-encoded bodies
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    app.get('/cluster', (req, res) =>
      res.send({
        isMaster: cluster.isMaster,
        isWorker: cluster.isWorker,
        workers: cluster.workers,
        pid: process.pid
      })
    );
    // Dummy route to return JSON
    app.get('/', (req, res) => {
      res.send(require('http').STATUS_CODES);
    });

    // callback from /index.js
    cb(app);
  };
})();
