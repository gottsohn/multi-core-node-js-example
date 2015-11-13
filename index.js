(function() {
  'use strict';

  let cluster = require('cluster');
  // Condition that checks if we are on the master process, before creating child processes.
  if (cluster.isMaster) {
    // Fork all the workers.
    let numCPUs = require('os').cpus().length;
    //  / (parseInt(process.env.CLUSTER_DIVIDER, 10) || 1);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    Object.keys(cluster.workers).forEach(id => {
      console.log("Running with process ID: " + cluster.workers[id].process.pid);
    });

    cluster.on('exit', (worker, code, signal) => {
      const RESTART_DELAY = parseInt(process.env.RESTART_DELAY, 10) || 30000;
      console.log('Process ID: ' + worker.process.pid + ' died, creating new worker in ' + (RESTART_DELAY / 1000) + ' seconds');
      setTimeout(cluster.fork, RESTART_DELAY);
    });
  } else {
    const PORT = process.env.PORT || 5555;
    require('./server/app')(process.cwd(), app => {
      app.listen(PORT, (err) => {
        console.log(err || 'Proctor Server running on ', PORT, ' Process ID: ' + process.pid);
      });
    });
  }
})();
