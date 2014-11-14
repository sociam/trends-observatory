/* jshint undef: true, strict:false, trailing:false, unused:false, quotmark:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, window, document, Image, Backbone, syncedStorageGUID */

(function() {
	angular
		.module('trends').factory('utils',function() {
			var DEBUG=0, INFO=1, LOG=2, WARN=3, ERROR=4, DEBUG_LEVEL = DEBUG;
			var jQ = jQuery;
			return {
				DEBUG_LEVELS: { INFO:INFO, LOG:LOG, WARN:WARN, ERROR:ERROR },
				SEVEN_DAYS_USEC : 5*24*60*60*1000, 
				TWENTY_FOUR_HOURS_USEC : 24*60*60*1000,
				DOW_SHORT: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
				DOW_FULL:['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				MON_SHORT : ['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec'],
				MON_FULL : ['January','February','March','April','May','June','July','August','September','October','November','December'],
                REMOTE_SERVER_URL: "https://danielsmith.eu/affinity-server/",
                plusDays:function(d,i) { return this.daysOffset(d,i); },
                //plusDays:function(d,i) { return new Date(d.getTime() + (this.TWENTY_FOUR_HOURS_USEC*i)) },
				startofDay: function(d) { 
					d = new Date(d);
					d.setHours(0);
					d.setMinutes(0);
					d.setSeconds(0);
					d.setMilliseconds(0);
					return d;
				},
				daysOffset : function(d, i) { 
					d = new Date(d.valueOf()); 
					d.setDate(d.getDate()+i);					
					return d;
				},
				yearsOffset : function(d, yi) { 
					d = new Date(d.valueOf()); 
					d.setFullYear(d.getFullYear()+yi);					
					return d;
				},
				getDaysOffsetFromToday : function(d) { 
					var today = new Date(),
						val = (new Date(d).valueOf() - today.valueOf())/this.TWENTY_FOUR_HOURS_USEC;
					// console.log('GDOFT', new Date(d), this.isToday(d), val, Math.round(val));
					return Math.round(val);
				},
                toMonthYear: function (d) {
                    return d.getDate() + " " + this.MON_FULL[d.getMonth()] + " " + d.getFullYear();
                },
				toHHMMampm:function(d) { 
					var hh = d.getHours(),
						mm = d.getMinutes();
					if (hh > 12) { return (hh-12)+":"+this.paddate(mm) +' pm'; }
					return (hh)+":"+this.paddate(mm) +' am';
				},
				validateEmail:function(email) {
					if (email === undefined) return false;
					if (email.length === 0) { 
						return false;
					}
					if (email.length < 4 || email.indexOf('@') <= 0 || email.indexOf('.') <= 0) { 
						return "That doesn't look like a valid email address. Please try again";
					}
					return true;
				},
                warfarinSchedules: {
                    "sameeveryday": {
                        "name": "Same Every Day",
                        "days": 1,
                        "daynames": [
                            "Daily",
                        ],
                    },
                    "alternating": {
                        "name": "Alternating Days",
                        "days": 2,
                        "daynames": [
                            "M/W/F/Su",
                            "Tu/Th/Sa",
                        ],
                    },
                    "differenteveryday": {
                        "name": "Different Every Day",
                        "days": 7,
                        "daynames": [
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                        ],
                    },
                    "weekendsdifferent": {
                        "name": "Different on Weekends",
                        "days": 2,
                        "daynames": [
                            "Weekdays",
                            "Weekends",
                        ],
                    },
                },
                dailyFreqs:{
                    "1d":
                        {
                            "name": "once a day",
                            "perday": 1,
                        },
                    "2d":
                        {
                            "name": "twice a day",
                            "perday": 2,
                        },
                    "3d":
                        {
                            "name": "three times a day",
                            "perday": 3,
                        },
                    "4d":
                        {
                            "name": "four times a day",
                            "perday": 4,
                        }
                },
                paddate: function (i) {
                    var s = i + "";
                    if (s.length == 1) {
                        s = "0" + s;
                    }
                    return s;
                },
                getAge: function (profile) {
                    // returns age, OR returns true if one of the fields is missing OR returns false is the age is invalid 
                    var that = this;
                    var personal = that.getModel(profile, "personal");

                    var birthyear = personal.get("birthyear");
                    var birthmonth = personal.get("birthmonth");
                    var birthdate = personal.get("birthdate");

                    if (!birthyear || !birthmonth || !birthdate) {
                        return true;
                    }

                    var age = Math.floor(( new Date().valueOf() - new Date(birthyear, birthmonth, birthdate).valueOf() )/(365*that.TWENTY_FOUR_HOURS_USEC));
                    if (!age || age < 0 || age > 150) {
                        return false;
                    }
                    return age;
                },
                getModel: function(collection, id) {
                    // console.log("utils getModel collection: ", collection.id, "models:", JSON.stringify(collection.models.map(function(m){return m.id + ": " + JSON.stringify(m.attributes)})));
                    var model = collection.get(id);
                    // console.log("model", model);
                    if (!model) {
                        // console.log("model null");
                        var localCommits = collection.commitCollection;
                        var newAttrs = {"id": id};
                        var newUuid = syncedStorageGUID();
                        var localCommit = new localCommits.model({
                            id: id,
                            uuid: newUuid,
                            previousUuid: "ignoredbyserver",
                            timestamp: Date.now(), // won't matter because uuids will match
                            object: JSON.stringify(newAttrs),
                            synced: false,
                            deleted: false, 
                        });
                        localCommits.add(localCommit);

                        model = new collection.model(newAttrs);
                        model.commitModel = localCommit;
                        collection.add(model);

                        localCommit.save();

                    } else {
                        // console.log("model attributes", JSON.stringify(model.attributes));
                    }
                    return model;
                },
                avg:function(l) {
                	return l.reduce(function(x,y) { return x+y; },0)/(1.0*l.length);
                },
				toISODateString:function(d) { 
					d = new Date(d.valueOf());
					return [d.getFullYear(), this.padded(d.getMonth() + 1), this.padded(d.getDate())].join('-'); // do not use getISODate
				},
				daysinMonth:function(mm,yyyy) {
				    return new Date(yyyy, mm, 0).getDate();
				},
				toISOTimeString:function(t) { 
					return this.padded(t.getHours())+":"+this.padded(t.getMinutes());
				},
				profilePhotoStyle : function(url) {
					return { 'background' : 'url('+url+') no-repeat center center', 'background-size' : 'cover' };
				},
				padded:function(n) { 
					return n < 10 ? '0'+n : ''+n;
				},
				endofDay:function(d) { 
					d = new Date(d);
					d.setHours(23);
					d.setMinutes(59);
					d.setSeconds(59);
					d.setMilliseconds(999);
					return d;
				},
				isToday:function(d) { 
					return (this.startofDay(d).valueOf() == this.startofDay(new Date()).valueOf());
				},
				setDebugLevel:function(lvl) {	DEBUG_LEVEL = lvl; return lvl; },
                uuid: function(){ return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});},
                toBlankDict:function(L) {
                	var o = {};
                	L.map(function(l) { o[l] = true; });
                	return o;
                },
				toQueryTime : function(date) {	
					return date.toISOString().slice(0,-5);	// chop off the .000Z or queries don't like it
				}, 
                zip:function(a1,a2) {
                	return this.range(Math.min(a1.length,a2.length)).map(function(i) {
                		return [a1[i],a2[i]];
                	});
                },
                splitStringIntoChunks:function(str,len) {
					var ret = [ ];
					for (var offset = 0, strLen = str.length; offset < strLen; offset += len) {
						ret.push(str.substring(offset, offset + len));
					}
					return ret;
                },
                splitStringIntoChunksObj:function(str,len) {
					var ret = {};
					for (var i = 0, strLen = str.length; i*len < strLen; i += 1) {
						ret[""+i] = str.substring(i*len, (i+1)*len);
					}
					return ret;
                },
                chooseRandom:function(r) {
                	var i = Math.floor(r.length*Math.random());
                	return r[i];
                },
                joinModelChunksIntoString:function(model) {
                	// inverse of the last method
					var strs = [], val;
					for (var i = 0; (val = model.peek(''+i)) !== undefined; i++) {
						strs.push(val);
					}
					return strs.join("");
				},
                inherit:function(p) {
                	// inherit() returns a newly created object that inherits properties from the
					// prototype object p.  It uses the ECMAScript 5 function Object.create() if
					// it is defined, and otherwise falls back to an older technique.
				    if (p === null) throw TypeError(); // p must be a non-null object
				    if (Object.create)                // If Object.create() is defined...
				        return Object.create(p);      //    then just use it.
				    var t = typeof p;                 // Otherwise do some more type checking
				    if (t !== "object" && t !== "function") throw TypeError();
				    function f() {}                  // Define a dummy constructor function.
				    f.prototype = p;                  // Set its prototype property to p.
				    return new f();                   // Use f() to create an "heir" of p.
				},
				fastkeys:function(obj) {
                	return Object.keys(obj); 
                },
                hashModulo:function(strings,n) {
                	return Math.abs(this.hash(strings.join(''))%n);
                },
                parseYYYYMMDD:function(s) { 
                	return new Date(s.replace(/\-/g, '/'));
                },
                numberGUID: function (len) {
                    var alpha = "0123456789";
					return this.range(0,len-1).map(function(x) {
						return alpha[Math.floor(Math.random()*alpha.length)];
					}).join('');
                },
				guid: function(len) {
					len = len || 64;
					var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-';
					return this.range(0,len-1).map(function(x) {
						return alpha[Math.floor(Math.random()*alpha.length)];
					}).join('');
				},
				memoise:function(f) { 
					var cached_args, cached_result, this_ = this;
					return function() {
						var args = _(arguments).toArray();
						if (cached_result && 
							((!cached_args && args.length === 0) || (_(args).isEqual(cached_args)))) {
							return cached_result; 
						}
						cached_args = args.concat();
						cached_result = f.apply(this_,args);
						return cached_result;
					};
				},
				memoise_fast1:function(f) {
					// only 1 argument function
					var cached_arg, cached_result, this_ = this;
					return function() {
						var arg = arguments[0];
						if (cached_result && (arg == cached_arg)) { return cached_result; }
						cached_arg = arg;
						cached_result = f(arg);
						return cached_result;
					};
				},
				mean:function(arr) {
					return arr.reduce(function(x,y) { return x+y; }, 0)/(1.0*arr.length);
				},
				uniqstr:function(L) {
					var o = {}, i, l = L.length, r = [];
					for(i=0; i<l;i+=1) { o[L[i]] = L[i]; }
					for(i in o) { r.push(o[i]);	}
					return r;
				},
				setHHMM:function(d, s) { 
					// let's split s into hours and strings
					// s in military time
					var hhmm = s.split(':'),
						hh = parseInt(hhmm[0]),
						mm = parseInt(hhmm[1]);
					d = new Date(d.valueOf());
					d.setHours(hh);
					d.setMinutes(mm);
					d.setSeconds(0);
					d.setMilliseconds(0);
					return d;
				},
				dmap: function(L, fn) {
					console.log('dmap :: ', L, L[0]);
					if (L.length === 0) { return this.dresolve([]); }
					var d = this.deferred(), this_ = this;
					fn(L[0]).then(function(result) {
						console.log('L[0] ok, recursing with ', L.slice(1));
						this_.dmap(L.slice(1), fn).then(function(rest) {
							d.resolve([result].concat(rest));
						}).fail(d.reject);
					}).fail(d.reject);
					return d.promise();
				},
				quickSame:function(a,b) { 
					// a, b are two Arrays
					if (a.length !== b.length) { return false; }
					for (var i = 0; i < a.length; i++) {
						if (a[i] !== b[i]) return false;
					}
					return true;
				},
				safeApply: function($scope, fn) { if (window) { window.setTimeout(function() { $scope.$apply(fn); }, 0); } },
				log : function() { try { if (DEBUG_LEVEL >= LOG) { console.log.apply(console,arguments);  }} catch(e) { } },
				warn : function() { try { if (DEBUG_LEVEL >= WARN) { console.warn.apply(console,arguments);  }} catch(e) { } },
				debug : function() { try { if (DEBUG_LEVEL >= DEBUG) { console.debug.apply(console,arguments); }} catch(e) { } },
				error : function() { try { if (DEBUG_LEVEL >= ERROR) { console.error.apply(console,arguments); }} catch(e) {}},
				isInteger:function(n) { return n % 1 === 0; },
				deferred:function() { return new jQ.Deferred(); },
				chunked:function(l,n) {
					return this.range(Math.floor(l.length / n) + (l.length % n === 0 ? 0 : 1)).map(function(ith) { 
						var start = ith*n;
						return l.slice(start, start+n);
					});
				},
				removeNOf:function(list, fn, N) { 
					var newlist = [],
						killed = [];
					list.map(function(li) { 
						if (killed.length >= N || !fn(li)) { 
							newlist.push(li);
						} else {
							killed.push(li);
						}
					});
					return newlist;
				},
				shake:function(el, times, px) {
					var d = new jQ.Deferred(), l = px || 20;
					for (var i = 0; i < 4; i++) {
						jQuery(el).animate({'margin-left':"+=" + (l = -l) + 'px'}, 50);
					}
					// todo
					d.resolve();
					return d.promise();
				},
				dresolve:function(val) {
					var d = new jQ.Deferred();
					d.resolve(val);
					return d.promise();
				},
				dreject:function(err) {
					var d = new jQ.Deferred();
					d.reject(err);
					return d.promise();
				},
				whend:function(deferredArray) { return jQuery.when.apply(jQuery,deferredArray); },
				t:function(template,v) { return _(template).template(v); },
				assert:function(t,s) { if (!t) { throw new Error(s); }},
				TO_OBJ: function(pairs) { var o = {};	pairs.map(function(pair) { o[pair[0]] = pair[1]; }); return o; },
				dict: function(pairs) { var o = {};	pairs.map(function(pair) { o[pair[0]] = pair[1]; }); return o; },
				dictCat: function(pairs) { 
					var o = {};	
					pairs.map(function(pair) { 
						var key = pair[0];
						o[key] = o[key] ? o[key].concat(pair[1]) : [pair[1]]; 
					}); 
					return o;
				},
				flatten:function(l) { return l.reduce(function(x,y) { return x.concat(y); }, []); },
				DEFINED:function(x) { return (!_.isUndefined(x)) && x !== null; },
				defined:function(x) { return (!_.isUndefined(x)) && x !== null; },
				indexOfUkPostcode:function(s) {
					var re = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) {0,1}[0-9][A-Za-z]{2})$/g;
					return s.search(re);
				},
				NotImplementedYet:function() {
					throw new Error('Not Implemented Yet');
				},
				resizeImage:function(dataURI, width, height) {
					var d = this.deferred(), this_ = this;
					if (dataURI) {
			            var canvas, context, image, imageData;
			            canvas = document.createElement('canvas');
			            canvas.width = width;
			            canvas.height = height;
			            context = canvas.getContext('2d');
			            image = new Image();
			            image.addEventListener('load', function(){
							// console.log('resize load');
							var cw = image.width, ch = image.height;
							var ratio = width*1.0/cw;
							// console.log('new width height ', cw, ch, canvas.width, Math.round(ratio*ch));
			                context.drawImage(image, 0, 0, canvas.width, Math.round(ratio*ch)); // , canvas.height);
			                imageData = context.getImageData(0, 0, canvas.width, canvas.height);
			                d.resolve(canvas.toDataURL());
			            }, false);
			            image.src = dataURI;
			        } else { d.reject(); }
			        return d.promise();
				},
				getParameterByName: function(name,str) {
					name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
					var regexS = "[\\?&]" + name + "=([^&#]*)";
					var regex = new RegExp(regexS);
					var results = regex.exec(str || window.location.search);
					if (results === null)
						return "";
					else
						return decodeURIComponent(results[1].replace(/\+/g, " "));
				},
				range:function(l,h) {
					var a = [];
					if (_.isUndefined(h)) { h = l; l = 0; }
					for (var i = l; i < h; i++) { a.push(i); }
					return a;
				},
				isValidURL:function(str) {
					// from http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-an-url
					var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
					  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
					  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
					  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
					  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
					  '(\\#[-a-z\\d_]*)?$','i');
					return pattern.test(str);
				},
				toNumeric:function(v) {
					if (_(v).isNumber()) { return v ; }
					if (typeof(v) == 'string') { return parseFloat(v, 10); }
					return undefined; // throw new Error("Could not convert ", v);
				},
				when:function(x) {
					var d = this.deferred();
					jQ.when.apply(jQ,x).then(function() {	d.resolve(_.toArray(arguments)); }).fail(d.reject);
					return d.promise();
				},
				whenSteps:function(fns, failFast) {
					// executes a bunch of functions that return deferreds in sequence
					var me = arguments.callee;
					var d = new jQ.Deferred();
					if (fns.length == 1) { return fns[0]().then(d.resolve).fail(d.reject);	}
					fns[0]().then(function() {
						me(fns.slice(1));
					}).fail(function() {
						if (failFast === true) { return; }
						me(fns.slice(1));
					});
					return d;
				},
				hash:function(s) {
					var hash = 0;
					if (s.length === 0) { return hash; }
					for (var i = 0; i < s.length; i++) {
						var ch = s.charCodeAt(i);
						hash = ((hash<<5)-hash)+ch;
						hash = hash & hash; // Convert to 32bit integer
					}
					return hash;
				}
			};
		}).filter('orderModelBy', function() {
		    var filtered = [], olditems,
		    	compare = function(x,y) {
			    	if (_.isObject(x) && x instanceof Backbone.Model) { 
			    		return _.isObject(y) && x.id == y.id;
			    	}
			    	return x == y;
			    };
			return function(items, field, reverse) {
				// console.log('omb incoming ', items, field, reverse, 'olditems ', olditems, ' filtered ', filtered);
				if (olditems !== undefined && items.length == olditems.length) {

					// now check to see if keys are equal
					if (_(olditems).difference(items).length === 0) {
						return filtered;
					}
				}
				filtered.splice(0);
			    angular.forEach(items, function(item) { filtered.push(item); });
			    // console.log('orderModelBy filtered .. ', filtered);
			    filtered.sort(function (a, b) {
					var av = a.get(field), bv = b.get(field);
					if (_.isDate(av)) { av = av.valueOf(); }
					if (_.isDate(bv)) { bv = bv.valueOf(); }
					return reverse ? (av > bv ? -1 : 1) : (av > bv ? 1 : -1);
			    });
			    if(reverse) filtered.reverse();
			    olditems = items;
			    // console.log('orderModelBy returning ', filtered);
			    return filtered;
			};
		}).filter('orderByKeyNumberGetPairs', function() {
			var filtered = [], olditems,
				compare = function(x,y) { 
			    	if (_.isArray(x)) { 
			    		return _.isArray(y) && _(x).difference(y).length === 0;
			    	}
			    	return x == y;
			    };
			return function(items, reverse) {
				// console.log('orderByKNP - items', items, reverse);
				if (olditems !== undefined && _(items).keys().length === _(olditems).keys().length) {
					// now check to see if keys are equal
					var eq = _(olditems.attributes).keys().map(function(k) { 
						return items[k] !== undefined && compare(items[k], olditems[k]);
					}).reduce(function(a,b) { return a && b; }, true);
					// console.log('shortcutting ');
					if (eq) { return filtered; }
				}
				filtered.splice(0);
			    angular.forEach(items, function(item, key) { filtered.push([key,item]); });
			    // console.log('orderbyKNP - filtered .. ', filtered);
			    filtered.sort(function (a, b) {
			      var av = parseInt(a[0]), bv = parseInt(b[0]);
			      return av > bv ? 1 : -1;
			    });
			    if(reverse) { filtered.reverse(); }
			    olditems = items;			    
			    // console.log('orderByKNP returning ', filtered);
			    return filtered; //  warning! returns pairs 
			};
		}).directive('intlink', function() { 
			return {
				restrict:'E',
				scope:{href:'@'},
				transclude:true,
				replace:true,
				template:'<span class="link" ng-click="openURL()" ng-transclude></span>',
				controller:function($scope) { 
					$scope.openURL = function() { 
						console.log('opening external url > ', $scope.href);
						if ($scope.href !== undefined) { window.open($scope.href, '_blank', 'location=no,EnableViewPortScale=yes'); }
					};
				}
			};
		}).directive('extlink', function() { 
			return {
				restrict:'E',
				scope:{href:'@'},
				transclude:true,
				replace:true,
				template:'<span class="link" ng-click="openURL()" ng-transclude></span>',
				controller:function($scope) { 
					$scope.openURL = function() { 
						if ($scope.href !== undefined) { window.open($scope.href, '_system', 'location=no'); }
					};
				}
			};
		}).directive('miscitem', function() { 
			return {
				restrict:'E',scope:{name:'@'},
				transclude:true,
				replace:true,
				template:'<span class="link" ui-sref="miscitem({id:name})" ng-transclude></span>'
			};
		}).directive('diagnosis', function() { 
			return {
				restrict:'E',scope:{name:'@'},
				transclude:true,
				replace:true,
				template:'<span class="link" ui-sref="diagnosis({id:name})" ng-transclude></span>'
			};
		}).directive('medi', function() { 
			return {
				restrict:'E',scope:{name:'@'},
				transclude:true,
				replace:true,
				template:'<span class="link" ui-sref="glossary-med({id:name})" ng-transclude></span>'
			};
		}).directive('bindHtmlCompile', ['$compile', function ($compile) {
	        return {
	            restrict: 'A',
	            link: function (scope, element, attrs) {
	            	var lastval;
	                scope.$watch(function () {
	                    var value = scope.$eval(attrs.bindHtmlCompile);
	                    if (value !== lastval) { 
		                    // console.log('value >> ', value.toString());
		                    element.html(value.toString());
		                    $compile(element.contents())(scope);
		                    lastval = value;
		                }
	                });
	            }
	        };
	    }]);
}());