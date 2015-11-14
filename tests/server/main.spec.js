(() => {
  'use strict';
  const APP_URL = 'http://localhost:' + (process.env.PORT || 5555) + '/';
  //require('../../');
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
          requestCount = 20,
          pids = [];
        let cb = (body) => {
          count++;
          if (pids.indexOf(body.pid) === -1) {
            pids.push(body.pid);
          }
          if (count === requestCount) {
            done();
            console.log('Process IDs', pids);
            expect(pids).to.not.be.empty();
            expect(pids.length).to.be.greatherThan(1);
            if (requestCount > 4) {
              expect(pids.length).to.be(4);
            } else {
              expect(pids.length).to.be(requestCount);
            }
          }
        };

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
