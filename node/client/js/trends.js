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
                    tt.trends = computeDeltas([], tt.trends);
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
            var old = [];
            console.log((typeof socmacs[data.source].locations[data.location].trends), socmacs[data.source].locations[data.location].trends);
            if (typeof socmacs[data.source].locations[data.location].trends !== 'undefined' && 
                socmacs[data.source].locations[data.location].trends.length > 0 && 
                typeof socmacs[data.source].locations[data.location].trends[0] !== 'underfined') {
                socmacs[data.source].locations[data.location].trends[0].list.map(function(e) { old.push(e); });
            }
            socmacs[data.source].locations[data.location].trends = []; //this is different from loading from file, because we reset the trends between loads
            data.trends = computeDeltas(old, data.trends);
            socmacs[data.source].locations[data.location].trends.push({"timestamp":data.timestamp["$date"], "list":data.trends});
            $scope.socmacs = socmacs;
            console.log($scope.socmacs);            
        }

        function computeDeltas(oldT, newT) {
            if (oldT.length > 0) {
                for (nti in newT) {
                    var nt = newT[nti];
                    nt['delta'] = 100;
                    for (oti in oldT) {
                        var ot = oldT[oti];
                        if (nt.label === ot.label) {
                            nt.delta = ot.rank - nt.rank ;
                        }
                    }
                }
            } else {
                for (nti in newT) {
                    var nt = newT[nti];
                    nt['delta'] = 100;
                }
            }
            console.log("added deltas ", oldT, newT);
            return newT;
        }

        $scope.deltaImage = function(delta) {
            switch(delta) {
                case 0:
                    return "glyphicon-arrow-right";
                case 1:
                    // go next
                case 2:
                    // go next
                case 3:
                    // go next
                case 4:
                    // go next
                case 6:
                    // go next
                case 7:
                    // go next
                case 8:
                    // go next
                case 9:
                    return "glyphicon-arrow-up"
                case -1:
                    // go next
                case -2:
                    // go next
                case -3:
                    // go next
                case -4:
                    // go next
                case -5:
                    // go next
                case -6:
                    // go next
                case -7:
                    // go next
                case -8:
                    // go next
                case -9:
                    return "glyphicon-arrow-down";
                default: 
                    return "glyphicon-star";
            }
        }

        $scope.flagClass = function(location) {
            switch (location) {
                case "London, United Kingdom":
                case "United States":
                    return "us";
                case "Washington, United States":
                case "United Kingdom":
                    return "uk";
                default:
                    return "ww";
            }
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

        // function loopIntervals () {
        //     console.log("start of interval is: ", $scope.interval);
        //     setTimeout(function () {    
        //         if ($scope.interval < (new Date()).valueOf()) {
        //             $scope.interval = $scope.interval+300000;
        //             loopIntervals();
        //         }
        //     }, 3000);
        // }

        // $scope.interval = new Date("2014-10-16").valueOf();
        loadMeta().then(function(sm) {
            loadTrendsFromFile(sm, "trends.json").then(function(data) {
            // mysocket.addListener("trends", function (data) {
                console.log("trends", data);
            //     if (Object.getOwnPropertyNames(data).length > 0) {
            //         loadTrendsFromHose(sm, data);
            //         console.log("got new data: ", data, $scope.socmacs); 
            //     }
            });
            console.log("added listener", sm);
        });
    });