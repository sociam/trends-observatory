var util = require('util'),
    amqp = require('amqp'),
    config = require('./config'),
    connection = amqp.createConnection(config.connection, {defaultExchangeName: config.exchange});

connection.on('error', function (e) { console.log("error:", e); });
connection.on('ready', function () {
    connection.queue('', function (q) {
        config.exchanges.map(function(exc) { q.bind(exc, ''); });
        q.subscribe(function (message, headers, deliveryInfo, messageObject) {
            console.log('headers ', deliveryInfo.exchange);
            console.log('emitting ', message.data.toString());
            io.sockets.emit(deliveryInfo.exchange, {"data": message.data.toString()});
        });
    });
});

var server = require('http').Server();
var io = require('socket.io')(server);
io.on('connection', function(socket){
  socket.on('event', function(data){});
  socket.on('disconnect', function(){});
});

var port = 3000;
console.log("Listening on port", port);
server.listen(port);

