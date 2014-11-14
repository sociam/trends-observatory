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

            $.getJSON("contents.json").success(function(json) {
                // console.log(json); 
                $scope.locations = json.locations;
                $scope.socmacs = json.sources;
                for (source in json.sources) {
                    for (loc in json.sources[source].locations) {
                        $scope.socmacs[source].locations[loc] = $scope.locations[json.sources[source].locations[loc]];
                    }
                }
                console.log($scope.socmacs);
            });
        }

        function loadData() {
            $.getJSON("trends.json").success(function(json) {
                // console.log(json);
                for (tti in json) {
                    tt = json[tti];
                    $scope.socmacs[tt.source].locations[tt.location]['trends'] = tt.trends;
                }
            });
        }

        loadMeta();
        loadData();

    });