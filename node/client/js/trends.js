angular.module('trends', ['btford.socket-io']) 
    .controller('main', function($scope, $rootScope) { 
    }).run(function() {}).factory('mysocket', function (socketFactory) {
        var myIoSocket = io.connect('http://app-001.ecs.soton.ac.uk:9001'), socket = socketFactory({ ioSocket: myIoSocket });
        return socket;
    }).controller('main', function($scope, mysocket, $sce, $http, $q) { 

        $scope.topics = []; // a topic has: terms: [list of strings], colour: #colour, [label/id??]
        $scope.defaultColour = "#707070";
        $scope.lastColAssigned = 0;
        $scope.colorScale = d3.scale.category10();

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
                    tt.trends = computeTopics(tt.trends);
                    socmacs[tt.source].locations[tt.location].trends.push({"timestamp":tt.timestamp["$date"], "list":tt.trends});
                }
                $scope.socmacs = socmacs;
                deferred.resolve($scope.socmacs);
            });
            return deferred.promise;
        }
 
        function loadTrendsFromHose(socmacs, data) {
            // console.log(data);
            // console.log(socmacs);
            var old = [];
            if (typeof socmacs[data.source].locations[data.location].trends !== 'undefined' && 
                socmacs[data.source].locations[data.location].trends.length > 0 && 
                typeof socmacs[data.source].locations[data.location].trends[0] !== 'undefined') {
                socmacs[data.source].locations[data.location].trends[0].list.map(function(e) { old.push(e); });
            }
            socmacs[data.source].locations[data.location].trends = []; //this is different from loading from file, because we reset the trends between loads
            data.trends = computeDeltas(old, data.trends);
            data.trends = computeTopics(data.trends);
            socmacs[data.source].locations[data.location].trends.push({"timestamp":data.timestamp["$date"], "list":data.trends});
            $scope.lastupdate = formatDate(new Date(data.timestamp["$date"]));
            $scope.socmacs = socmacs;
            // console.log($scope.socmacs);            
        }

        function getMonthName(month, short) {
          switch(month) {
            case 0:
              if (short) return "Jan";
              return "January";
            case 1:
              if (short) return "Feb";
              return "February";
            case 2:
              if (short) return "Mar";
              return "March";
            case 3:
              if (short) return "Apr";
              return "April";
            case 4:
              return "May";
            case 5:
              if (short) return "Jun";
              return "June";
            case 6:
              if (short) return "Jul";
              return "July";
            case 7:
              if (short) return "Aug";
              return "August";
            case 8:
              if (short) return "Sep";
              return "September";
            case 9:
              if (short) return "Oct";
              return "October";
            case 10:
              if (short) return "Nov";
              return "November";
            case 11:
              if (short) return "Dec";
              return "December";
          }
        }

        function padZero(x) {
          if (x>=0 && x<10) {
            return "0"+x;
          }
          return x;
        }

        function formatDate(d) {
          return padZero(d.getDate())+" "+getMonthName(d.getMonth(), true)+" "+padZero(d.getHours())+":"+padZero(d.getMinutes());
        }


        function computeTopics(trends) {
            trends.map( function(t) { 
                t['topic'] = findTopic(t.label);
            });
            return trends;
        }

        function findTopic(label) {
            var splits = label.split(/\s/);
            splits = _.union(splits, [label]);
            for (i in $scope.topics) {
                var found = _.intersection($scope.topics[i].terms, splits);
                console.log("found ",i, found, $scope.topics[i].terms, splits);
                if (found.length > 0) {
                    $scope.topics[i].terms = _.union($scope.topics[i].terms, splits);
                    if ($scope.topics[i].colour == $scope.defaultColour) {
                        console.log($scope.topics[i].colour);
                        $scope.topics[i].colour = assignNewColour();
                        console.log($scope.topics[i].colour);
                    }
                    return $scope.topics[i];
                }
            }
            var newTopic = { 'terms': splits, 'colour':$scope.defaultColour };
            $scope.topics.push(newTopic);
            return newTopic;
        }

        function assignNewColour() {
            var col = "";
            if ($scope.lastColAssigned < 10) {
                $scope.lastColAssigned++;
                col = $scope.colorScale($scope.lastColAssigned);
                if ($scope.lastColAssigned == 10) {
                    $scope.colorScale = d3.scale.category20();
                }
                return col;
            }
            if ($scope.lastColAssigned < 30) {
                $scope.lastColAssigned++;
                col = $scope.colorScale($scope.lastColAssigned-10);
                if ($scope.lastColAssigned == 30) {
                    $scope.colorScale = d3.scale.category20b();
                }
                return col;
            }
            if ($scope.lastColAssigned < 50) {
                $scope.lastColAssigned++;
                col = $scope.colorScale($scope.lastColAssigned-30);
                if ($scope.lastColAssigned == 50) {
                    $scope.colorScale = d3.scale.category20c();
                }
                return col;
            }
            if ($scope.lastColAssigned < 70) {
                $scope.lastColAssigned++;
                col = $scope.colorScale($scope.lastColAssigned-50);
                if ($scope.lastColAssigned == 70) {
                    $scope.lastColAssigned = 0;
                    $scope.colorScale = d3.scale.category10();
                }
                return col;
            }
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
            // console.log("added deltas ", oldT, newT);
            return newT;
        }

        $scope.deltaImage = function(delta) {
            switch(delta) {
                case 0:
                    // return "glyphicon-pause";
                    return "";
                case 1:
                case 2:
                case 3:
                case 4:
                case 6:
                case 7:
                case 8:
                case 9:
                    return "glyphicon-chevron-down"
                case -1:
                case -2:
                case -3:
                case -4:
                case -5:
                case -6:
                case -7:
                case -8:
                case -9:
                    return "glyphicon-chevron-up";
                default: 
                    return "glyphicon-star";
            }
        }

        $scope.flagPath = function(location) {
            switch (location) {
                case "Washington, United States":                
                    return "img/washington_rect.png";
                case "United States":
                    // return "img/us.png";
                    return "img/us_rect.png";
                case "London, United Kingdom":                    
                    return "img/london_rect.png";
                case "United Kingdom":
                    // return "img/uk.png";
                    return "img/uk_rect.png";
                default:
                    return "img/www_rect.png";
            }
        };

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

        $scope.topicColour = function(topic) {
            return $scope.topics[topic];
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

        var makeBoxes = function() {
            $scope.boxes = [];
            for (sm in $scope.socmacs) {
                for (loc in sm.locations) {
                    
                }
            }
        }

        // $scope.interval = new Date("2014-10-16").valueOf();
        loadMeta().then(function(sm) {
            // loadTrendsFromFile(sm, "trends_1.json").then(function(data) {
            mysocket.addListener("trends", function (data) {
                console.log("trends", data);
                // makeBoxes();
                if (Object.getOwnPropertyNames(data).length > 0) {
                    loadTrendsFromHose(sm, data);
                    console.log("got new data: ", data, $scope.socmacs); 
                }
            });
            console.log("added listener", sm);
        });
    });