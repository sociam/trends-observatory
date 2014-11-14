angular.module('trends', ['btford.socket-io']) 
    .controller('main', function($scope, $rootScope) { 
    }).run(function() {}).factory('mysocket', function (socketFactory) {
        var myIoSocket = io.connect('http://localhost:3000/'),
            socket = socketFactory({ ioSocket: myIoSocket });
        return socket;
    }).controller('main', function($scope, mysocket, $sce, $http, $q) { 
        mysocket.addListener("trends_hose", function (data) {
            console.log("trends", data);
            data = JSON.parse(data.data);
        });

        function loadMeta() {
            var deferred = $q.defer();
            $.getJSON("contents.json").success(function(json) {
                // console.log(json);
                $scope.socmacs = json.sources;
                deferred.resolve($scope.socmacs);
            }).fail(function(e) {console.log("fail to load meta", e);});
            return deferred.promise;
        }

        function loadData(socmacs) {
            var deferred = $q.defer();
            $.getJSON("trends.json").success(function(json) {
                // console.log(json);
                for (tti in json) {
                    tt = json[tti];
                    socmacs[tt.source].locations[tt.location].trends.push({"timestamp":tt.timestamp["$date"], "list":tt.trends});
                }
                $scope.socmacs = socmacs;
                deferred.resolve($scope.socmacs);
            });
            return deferred.promise;
        }

        loadMeta().then(loadData).then(function(sms) {console.log(sms);} );

    });