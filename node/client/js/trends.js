angular.module('trends', ['btford.socket-io']) 
    .controller('main', function($scope, $rootScope) { 
    }).run(function() {}).factory('mysocket', function (socketFactory) {
        var myIoSocket = io.connect('http://app-001.ecs.soton.ac.uk:9001'), socket = socketFactory({ ioSocket: myIoSocket });
        return socket;
    }).controller('main', function($scope, mysocket, $sce, $http, $q) { 

        function loadMeta() {
            var deferred = $q.defer();
            $.getJSON("contents.json").success(function(json) {
                // console.log(json);
                $scope.socmacs = json.sources;
                deferred.resolve($scope.socmacs);
            }).fail(function(e) {console.log("fail to load meta", e);});
            return deferred.promise;
        }

        function loadTrendsFromFile(socmacs, filename) {
            var deferred = $q.defer();
            $.getJSON(filename).success(function(json) {
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

        function loadTrendsFromHose(socmacs, data) {
            console.log(data);
            // console.log(socmacs);
            socmacs[data.source].locations[data.location].trends = []; //this is different from loading from file, because we reset the trends between loads
            socmacs[data.source].locations[data.location].trends.push({"timestamp":data.timestamp["$date"], "list":data.trends});
            $scope.socmacs = socmacs;
            console.log($scope.socmacs);            
        }

        $scope.checkInterval = function(ts) {
            // console.log("checking ", ts);
            // if ($scope.interval <= ts) {
            //     if ($scope.interval+300000 > ts) {
            //         console.log("within interval");
            //         return true;
            //     }
            // }
            // return false;
            return true;
        }

        function loopIntervals () {
            console.log("start of interval is: ", $scope.interval);
            setTimeout(function () {    
                if ($scope.interval < (new Date()).valueOf()) {
                    $scope.interval = $scope.interval+300000;
                    loopIntervals();
                }
            }, 3000);
        }

        // $scope.interval = new Date("2014-10-16").valueOf();
        loadMeta().then(function(sm) {
            mysocket.addListener("trends", function (data) {
                console.log("trends", data);
                if (Object.getOwnPropertyNames(data).length > 0) {
                    loadTrendsFromHose(sm, data);
                    console.log("got new data: ", data, $scope.socmacs); 
                }
            });
            console.log("added listener", sm);
        });
    });