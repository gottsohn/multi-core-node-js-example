(() => {
  'use strict';
  const APP_URL = 'http://localhost:' + (process.env.PORT || 5555) + '/',
    THREAD_COUNT = require('os').cpus().length;

  let request = require('superagent'),
    expect = require('expect.js');

  describe('Node JS Multi-Threaded Instance', () => {
    describe('Instance', () => {
      it('should be a worker, and not the master', done => {
        request.get(APP_URL + 'cluster').
        accept('application/json')
          .end((err, res) => {
            expect(err).to.be(null);
            expect(res.status).to.be(200);
            expect(res.body).to.be.a('object');
            expect(res.body.isMaster).to.be(false);
            expect(res.body.isMaster).to.be.a('boolean');
            expect(res.body.isWorker).to.be(true);
            expect(res.body.pid).to.be.a('number');
            done();
          });
      });

      it('should load balance on threads using various processes', done => {
        let count = 0,
          requestCount = 4000,
          pids = [],
          cb = (body) => {
            count++;
            if (pids.indexOf(body.pid) === -1) {
              pids.push(body.pid);
            }

            if (count === requestCount) {
              console.log('Process IDs', pids);
              expect(pids).to.not.be.empty();
              expect(pids.length).to.be.greaterThan(1);
              if (requestCount > THREAD_COUNT) {
                // All threads will be used if the number of requests are equal or more then the threads
                expect(pids.length).to.be(THREAD_COUNT);
              } else {
                // If the requests are less than the number of threads, threads are used for each request only
                expect(pids.length).to.be(requestCount);
              }
              done();
            }
          };

        console.log('You have', THREAD_COUNT, 'CPU thread(s)');

        // Make simultaneous requests to the server to force load balacing.
        for (let i = 0; i < requestCount; i++) {
          console.log('Making request number', i + 1);
          request.get(APP_URL + 'cluster').
          accept('application/json')
            .end((err, res) => {
              expect(err).to.be(null);
              expect(res.status).to.be(200);
              cb(res.body);
            });
        }

      });
    });
  });
})();
