var newrelic = require('newrelic');
var async = require('async');
var restify = require('restify');

var server = restify.createServer();

server.get('/', function(req, res) {

  var tasks = [
    nonTraced(10),
    traced('A', 50),
    parallel([
      traced('B', 100),
      traced('C', 200),
    ]),
    traced('D', 50)
  ];

  async.series(tasks, function() {
    res.send(200 ,'hello world');
  });

});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

function parallel(tasks) {
  return function(callback) {
    async.parallel(tasks, callback);
  }
}

function nonTraced(ms) {
  return function(callback) {
    setTimeout(callback, ms);
  };
}

function traced(name, ms) {
  return function(callback) {
    setTimeout(newrelic.createTracer(name, callback), ms);
  };
}
