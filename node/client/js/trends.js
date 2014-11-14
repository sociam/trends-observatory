angular.module('trends', ['btford.socket-io']) 
    .controller('main', function($scope, $rootScope) { 
    }).run(function() {}).factory('mysocket', function (socketFactory) {
        var myIoSocket = io.connect('http://localhost:3000/'),
            socket = socketFactory({ ioSocket: myIoSocket });
        return socket;
    }).controller('main', function($scope, mysocket, $sce) { 
        mysocket.addListener("trends_hose", function (data) {
            console.log("trends", data);
            data = JSON.parse(data.data);
        });
    });