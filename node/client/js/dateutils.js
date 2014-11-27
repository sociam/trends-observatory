(function() {
	angular
		.module('trends').factory('dateutils', function() {
			var DEBUG=0, INFO=1, LOG=2, WARN=3, ERROR=4, DEBUG_LEVEL = DEBUG;
			var jQ = jQuery;
			return {
				SEVEN_DAYS_USEC : 5*24*60*60*1000, 
				TWENTY_FOUR_HOURS_USEC : 24*60*60*1000,
				DOW_SHORT: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
				DOW_FULL:['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				MON_SHORT : ['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec'],
				MON_FULL : ['January','February','March','April','May','June','July','August','September','October','November','December'],
                REMOTE_SERVER_URL: "https://danielsmith.eu/affinity-server/",
                plusDays:function(d,i) { return this.daysOffset(d,i); },
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
                padDate: function (i) {
                    var s = i + "";
                    if (s.length == 1) {
                        s = "0" + s;
                    }
                    return s;
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
                parseYYYYMMDD:function(s) { 
                	return new Date(s.replace(/\-/g, '/'));
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
			};
		});
}());